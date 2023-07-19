import { Query,FilterQuery } from "mongoose";
import ProductSchema, { ProductInterface } from "../models/product";
import ProductDetailSchema, { ProductDetailInterface } from "../models/productDetail";
import ItemSimilarityMatrixSchema, { ItemSimilarityMatrixInterface } from "../models/itemSimilarity";
import RecommendationSchema, { RecommendationInterface, RecommendationList } from "../models/recommendation";

import axios from 'axios';

import { getProfile } from "./userService";
import { findOrderByUser, getAllOrders } from "./orderService";
import order, { OrderSchema } from "../models/order";
import user from "../models/user";
import { findProductByID } from "./productService";


// get recommended products for guest users
export const findRecommendations = async ( ): Promise<ProductInterface[] | null> => {
  /* common conditions of recommendations */

  /* these information can be searched in product detail collection */
  const detail = await ProductDetailSchema.find({
    // one of fat, sugar, salt level should be low
    $or: [
      { fatLevel: "low" },
      { sugarLevel: "low" }, 
      { saltLevel: "low" },
    ],
    $nor: [
      { $and: [ { fatLevel: "high" }, { saltLevel : "high" }, { sugarLevel : "high" }]},
      { $and: [ { fatLevel: "high" }, { saltLevel : "high" }]},
      { $and: [ { fatLevel: "high" }, { sugarLevel : "high" }]},
      { $and: [ { saltLevel: "high" }, { sugarLevel : "high" }]},
    ]
  });

  // get id list of products which satisfy conditions above
  const productIds = detail.map((productDetail)=> productDetail.productID);

  /* these information can be searched in product collection */
  const commonConditions = {
    nutriScore: { $in: ["A", "B", "C"] },
    capacity: { $gt: 0 },
    productID: { $in: productIds }
  }

  /* 1. if user is a guest, return randomized products which satisfy conditions above  */
  return getRandomizedRecommendations(await ProductSchema.find({
      ...commonConditions,
  }))
}

// get recommended products for registered users
export const findRecommendationsWithCookies = async (_id: string): Promise<ProductInterface[] | null> => {
  const recommendationList = await getRecommendationListById(_id);
  if (recommendationList) {
    // map products ids in recommendation list to get product list
    const productIds = recommendationList.map(item => item.productID);
    const productList: ProductInterface[] = [];
    // for each product in recommendation list, find product by product id, and push into product list 
    for (const productId of productIds) {
      const product = await findProductByID(productId);
      if (product) {
        productList.push(product);
      }
    }

    // get randomized recommendations
    return getRandomizedRecommendations(productList);
  }
  return null;
};

export const getRecommendationListById = async (_id : string): Promise<RecommendationList[] | null | undefined> => {
  // find recommendations from database by user id
  const recommendation = await RecommendationSchema.findOne({
    userId : _id,
  });

  const recommendationList = recommendation?.recommendationList;

  // if recommendation list is not null, return.
  if (recommendation && recommendationList) {
    return recommendationList;
    } 
  // else, generate recommendation list and get again.
  else {
    await generateRecommendationList(_id);
    return getRecommendationListById(_id);
  }
}
  
  /* randomly return 12 recommendations */
  const getRandomizedRecommendations = (recommendationsList: ProductInterface[]): ProductInterface[] => {
    const random = recommendationsList.sort(() => Math.random() - 0.5);
    return random.slice(0, 12);
  };

  /* define the purchase record interface */
  interface PurchaseRecord {
    userId: string;
    productId: string;
  }

  /* get records of products and user id */
  const getPurchaseRecord = async ( ): Promise<PurchaseRecord[]> => {
    try {
      const orders = await getAllOrders();
      const purchaseRecords: PurchaseRecord[] = [];

    for (const order of orders) {
      const userId = order.userID;
      // for each order, get each product, and push the purchase code into the purchase record list
      for (const orderProduct of order.orderProducts) {
        const productId = orderProduct.product.productID.toString();
        const purchaseRecord: PurchaseRecord = {
          userId: userId,
          productId: productId,
        };
        purchaseRecords.push(purchaseRecord);
      }
    }
      return purchaseRecords;
    } catch (error) {
      throw new Error("Failed to retrieve purchase records");
    }
  };

  /* define Item-User Matrix */
  interface ItemUserMatrix {
    [itemId: string]: { [userId: string]: number };
  };

  /* build Item-User Matrix */
  const calculateItemUserMatrix = async (purchaseRecords: PurchaseRecord[]): Promise<ItemUserMatrix> => {
    // initialize the item user matrix with zero
    const productIds = new Set<string>();
    const userIds = new Set<string>();
  
    // products appeared in purchase record
    for (const record of purchaseRecords) {
      productIds.add(record.productId);
      userIds.add(record.userId);
    }
    // Create a 2D array filled with zeros, product id is the row index, and user id is column index
    const itemUserMatrix: ItemUserMatrix = {};
    for (const productId of productIds) {
      itemUserMatrix[productId] = {};

      for (const userId of userIds) {
        itemUserMatrix[productId][userId] = 0;
      }
    }
  
    // for each purchase record, update the corresponding input
    for (const record of purchaseRecords) {
      const { userId, productId } = record;
  
      // if a product id is not set to be the row index, then set
      if (!itemUserMatrix[productId]) {
        itemUserMatrix[productId] = {};
      }
  
      // if a user id is not set to be the column index, then set
      if (!itemUserMatrix[productId][userId]) {
        itemUserMatrix[productId][userId] = 0;
      }
  
      //calculate the purchase times
      itemUserMatrix[productId][userId] +=1 ;  
    }
  
    return itemUserMatrix;
  };

  /* create the similarity matrix */
  export const createItemSimilarityMatrix = async ( ): Promise<void> => {
    // delete the old item similarity matrix before create a new one
    await ItemSimilarityMatrixSchema.deleteMany({});

    // get purchase records
    const purchaseRecords = await getPurchaseRecord();

    // calculate item user matrix
    const itemUserMatrix = await calculateItemUserMatrix(purchaseRecords);
    // get list of product ids
    const itemIds = Object.keys(itemUserMatrix);
  
    // for each product in item user matrix, calculate the similarity of it and each another product
    for (let i = 0; i < itemIds.length; i++) {
      // get the id of item i
      const itemId1 = itemIds[i];
      // initialize the matrix column
      const matrixColumn = [];

      // for each other product except for product i, calculate the column of similarity matrix
      for (let j = 0; j < itemIds.length; j++) {
        if (i === j) {
          continue; // Skip comparing an item with itself
        }
        
        // get the id of item j
        const itemId2 = itemIds[j];

        // calculate cosine similarity of products using the vector gained from item-user matrix
        const similarity = calculateCosineSimilarity(itemUserMatrix[itemId1], itemUserMatrix[itemId2]);
        // push similarity and corresponding id to the matrix column
        matrixColumn.push(
          {
            productId: itemId2,
            similarity: similarity,
          },
        )
      }
      // save each column
      try {
        await ItemSimilarityMatrixSchema.create({
          productId: itemId1,
          matrixColumn: matrixColumn
        });
      } catch (error) {
        throw new Error('Failed to save item similarity matrix to the database.');
      }
    }
  };

  /* generate recommendation list for users */
  export const generateRecommendationList = async (_id: string): Promise<void> => {
    console.log("generateRecommendationList")
    /* 0. profile conditions */

    // get profile
    const profile = await getProfile(_id);

    // Firstly, the basic requirements must be fullfilled.
    const conditions1 = {
      $nor: [
        { $and: [ { fatLevel: "high" }, { saltLevel : "high" }, { sugarLevel : "high" }]},
        { $and: [ { fatLevel: "high" }, { saltLevel : "high" }]},
        { $and: [ { fatLevel: "high" }, { sugarLevel : "high" }]},
        { $and: [ { saltLevel: "high" }, { sugarLevel : "high" }]},
      ]
    };

    // Then, check the requirements in profile
    // initialize the condition list, which is used to check the conditions can be found in product detail colleciton
    const conditions2 = [];

    // push conditions dynamically
    // deal with health goal
    if (profile?.losingWeightAsGoal) {
      conditions2.push({ $and: [ { fatLevel: "low" }, { sugarLevel : "low" }]})
    };
    // fat/salt/sugar level
    if (profile?.lowInFat) {
      conditions2.push({ fatLevel: "low" });
    }

    if (profile?.lowInSalt) {
      conditions2.push({ saltLevel: "low" });
    }

    if (profile?.lowInSugar) {
      conditions2.push({ sugarLevel: "low" });
    }
    // type of eater
    if (profile?.typeOfEater === "vegan") {
      conditions2.push({ vegan:true });
    }
    if (profile?.typeOfEater === "vegetarian") {
      conditions2.push({ vegetarian:true });
    }

    // form a query
    const query: FilterQuery<ProductDetailInterface> = {
      $and: [conditions1, ...conditions2],
    };
    
    // get product list using query
    const detail2 = await ProductDetailSchema.find(query);

    // get ids of products which satisfy query conditions
    const productIds2 = detail2.map((productDetail)=> productDetail.productID);

    // other profile conditions which can be found in product colleciton
    const profileConditions = {
      nutriScore: { $in: profile?.nutriPreference },
      capacity: { $gt: 0 },
      productID: { $in: productIds2 }
    }

    /* 1. get all products bought by a user */
    const allProductList = await getAllProductsByUserId(_id)

    /* 2. search the similarity matrix, get the most similar products for each product bought by user */
    const recommendedIdArray = [];
    for (const productId in allProductList){
      recommendedIdArray.push(await getSimilarProducts(productId))
    }

    // remove the product appears more than one time in the recommended id array
    const flattenedArray = recommendedIdArray.flat();
    const recommendedIds = [...new Set(flattenedArray)];

    // form a query using recommened ids
    const queryConditions = {
      $and: [
        { productID: { $in: recommendedIds } },
        profileConditions
      ]
    };

    // get products which satisfy product conditions, in case that the number recommended products is less than 12
    const ProfileList = await ProductSchema.find({
      ...profileConditions,
    })

    // get profile products with valid image url
    const validProfileProducts = [];
    for (const product of ProfileList) {
      const isImageValid = await checkImageValidity(product.imageUrl);
      if (isImageValid) {
        validProfileProducts.push(product);
      }
    }

    // get recommended products
    const productList = await ProductSchema.find({
      ...queryConditions,
    })

    // get recommended products with valid image url
    const validRecommendProducts = [];
    for (const product of productList) {
      const isImageValid = await checkImageValidity(product.imageUrl);
      if (isImageValid) {
        validRecommendProducts.push(product);
      }
    }

    /* 3. generate a list and store it into database */
    const recommendationList = validRecommendProducts.map(item => ({ productID: item.productID }));

    // if the recommendation list is not long enough, add some products which satisfy product conditions
    while (recommendationList.length < 20 && validProfileProducts.length > 0) {
      const randomIndex = Math.floor(Math.random() * validProfileProducts.length);
      const randomProduct = validProfileProducts.splice(randomIndex, 1)[0]; // remove the random product
    
      // check if product already exists
      const isDuplicate = recommendationList.some(product => product.productID === randomProduct.productID);
      if (isDuplicate) {
        continue; // if duplicate, skip this product
      }

      // add random product to product list
      recommendationList.push(randomProduct); 
    }
    
    // update the recommendation list
    try {
      await RecommendationSchema.findOneAndUpdate(
        { userId: _id }, // query condition
        { userId: _id, recommendationList: recommendationList }, // data to be updated or deleted
        { upsert: true } // if dont exists, create a new one
      );
      
    } catch (error) {
      throw new Error('Failed to save item similarity matrix to the database.');
    }

  }

  /* get top 20 similar products */
  const getSimilarProducts = async (itemId : string) => {
    // get the row index
    const item = await ItemSimilarityMatrixSchema.findOne({
      productId : itemId,
    });
    // if item is not null, get the matrix column
    const similarProducts = item ? item.matrixColumn || [] : [];
    // sort the similar products by their similarity
    const sortedProducts = similarProducts.sort((a, b) => b.similarity - a.similarity);

    // get top 20 products, and get their ids
    const topProducts = sortedProducts.slice(0, 20);
    const topProductsIds = topProducts.map(product => product.productId);
    return topProductsIds;
  }

  /* get all products purchaed by user id */
  const getAllProductsByUserId =async (userID:string) => {
    const orderList = await findOrderByUser(userID);
    const productList = [];
    if (orderList) {
      for (let i = 0; i < orderList.length; i++) {
        const order = orderList[i];
        for (let j = 0; j < order.orderProducts.length; j++) {
          const productId = order.orderProducts[j].product.productID;
          productList.push(productId);
        }
      }
    }
    return(productList);
  }

  /* calculate cosine similarity of vectors */
  /* input vectors are composed of the times for each user buying each product  */
  function calculateCosineSimilarity(
    vector1: { [userId: string]: number },
    vector2: { [userId: string]: number }
  ): number {
    const dotProduct = calculateDotProduct(vector1, vector2);
    const magnitude1 = calculateMagnitude(vector1);
    const magnitude2 = calculateMagnitude(vector2);

    // similarity = (v1 dot multiply v2) / (|v1| * |v2|)
    const similarity = dotProduct / (magnitude1 * magnitude2);
    return similarity;
  }

  /* calculate dot product of vectors */
  function calculateDotProduct(
    vector1: { [userId: string]: number },
    vector2: { [userId: string]: number }
  ): number {
    let dotProduct = 0;
    for (const userId in vector1) {
      if (vector2.hasOwnProperty(userId)) {
        dotProduct += vector1[userId] * vector2[userId];
      }
    }
    return dotProduct;
  }

  /* calculate magnitude of vector */
  function calculateMagnitude(vector: { [userId: string]: number }): number {
    let magnitude = 0;
    for (const userId in vector) {
      magnitude += Math.pow(vector[userId], 2);
    }
    magnitude = Math.sqrt(magnitude);
    return magnitude;
  }

  /* check whether image url is valid */
  const checkImageValidity = async (imageUrl: string): Promise<boolean> => {
    try {
      const response = await axios.head(imageUrl);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  };