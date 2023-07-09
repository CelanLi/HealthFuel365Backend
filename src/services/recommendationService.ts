import { Query,FilterQuery } from "mongoose";
import ProductSchema, { ProductInterface } from "../models/product";
import ProductDetailSchema, { ProductDetailInterface } from "../models/productDetail";
import ItemSimilarityMatrixSchema, { ItemSimilarityMatrixInterface } from "../models/itemSimilarity";
import RecommendationSchema, { RecommendationInterface, RecommendationList } from "../models/recommendation";

import { getProfile } from "./userService";
import { findOrderByUser, getAllOrders } from "./orderService";
import order, { OrderSchema } from "../models/order";
import user from "../models/user";
import { findProductByID } from "./productService";


// for guest users
export const findRecommendations = async ( ): Promise<ProductInterface[] | null> => {
  console.log("findRecommendations")
  /* common conditions of recommendations */
  const detail = await ProductDetailSchema.find({
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
  const productIds = detail.map((productDetail)=> productDetail.productID);
  const commonConditions = {
    nutriScore: { $in: ["A", "B", "C"] },
    capacity: { $gt: 0 },
    productID: { $in: productIds }
  }
  /* 1. if user is a guest, return randomized products  */
  // TODO: maybe some popular products should be recommended to customers
  
  return getRandomizedRecommendations(await ProductSchema.find({
      ...commonConditions,
  }))
}

export const findRecommendationsWithCookies = async (_id: string): Promise<ProductInterface[] | null> => {
  console.log("findRecommendationsWithCookies");
  const recommendationList = await getRecommendationListById(_id);
  if (recommendationList) {
    const productIds = recommendationList.map(item => item.productID);
    const productList: ProductInterface[] = [];
    for (const productId of productIds) {
      const product = await findProductByID(productId);
      if (product) {
        productList.push(product);
      }
    }
    return getRandomizedRecommendations(productList);
  }
  return null;
};

export const getRecommendationListById = async (_id : string): Promise<RecommendationList[] | null | undefined> => {
  console.log("getRecommendationListById")
  const recommendation = await RecommendationSchema.findOne({
    userId : _id,
  });
  console.log(recommendation)

  const recommendationList = recommendation?.recommendationList;
  console.log("111",recommendation?.recommendationList)
  if (recommendation && recommendationList) {
    console.log("recommendationList",recommendationList)
    return recommendationList;
    } 
  else {
    console.log("222");
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
      // for each order, get each product
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
  
    for (const record of purchaseRecords) {
      productIds.add(record.productId);
      userIds.add(record.userId);
    }
    // Create a 2D array filled with zeros
    const itemUserMatrix: ItemUserMatrix = {};
    for (const productId of productIds) {
      itemUserMatrix[productId] = {};

      for (const userId of userIds) {
        itemUserMatrix[productId][userId] = 0;
      }
    }
  
    for (const record of purchaseRecords) {
      const { userId, productId } = record;
  
      if (!itemUserMatrix[productId]) {
        itemUserMatrix[productId] = {};
      }
  
      if (!itemUserMatrix[productId][userId]) {
        itemUserMatrix[productId][userId] = 0;
      }
  
      itemUserMatrix[productId][userId] +=1 ;  //calculate the purchase times
    }
  
    return itemUserMatrix;
  };

  /* create the similarity matrix */
  export const createItemSimilarityMatrix = async ( ): Promise<void> => {
    console.log("createItemSimilarityMatrix")
    await ItemSimilarityMatrixSchema.deleteMany({});

    // get purchase records
    const purchaseRecords = await getPurchaseRecord();
    // calculate item user matrix
    const itemUserMatrix = await calculateItemUserMatrix(purchaseRecords);
    const itemIds = Object.keys(itemUserMatrix);
  
    for (let i = 0; i < itemIds.length; i++) {
      const itemId1 = itemIds[i];
      const matrixColumn = [];
      for (let j = 0; j < itemIds.length; j++) {
        if (i === j) {
          continue; // Skip comparing an item with itself
        }
  
        const itemId2 = itemIds[j];
        const similarity = calculateCosineSimilarity(itemUserMatrix[itemId1], itemUserMatrix[itemId2]);
        matrixColumn.push(
          {
            productId: itemId2,
            similarity: similarity,
          },
        )
      }
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

    // profile conditions
    const profile = await getProfile(_id);

    // Firstly, the requirements in user profile must be fullfilled.
    const conditions1 = {
      $nor: [
        { $and: [ { fatLevel: "high" }, { saltLevel : "high" }, { sugarLevel : "high" }]},
        { $and: [ { fatLevel: "high" }, { saltLevel : "high" }]},
        { $and: [ { fatLevel: "high" }, { sugarLevel : "high" }]},
        { $and: [ { saltLevel: "high" }, { sugarLevel : "high" }]},
      ]
    };
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

    const query: FilterQuery<ProductDetailInterface> = {
      $and: [conditions1, ...conditions2],
    };
    
    const detail2 = await ProductDetailSchema.find(query);
    const productIds2 = detail2.map((productDetail)=> productDetail.productID);
    const profileConditions = {
      nutriScore: { $in: profile?.nutriPreference },
      capacity: { $gt: 0 },
      productID: { $in: productIds2 }
    }

    /* 1. get all products bought by a user */
    const allProductList = await getAllProductsByUserId(_id)

    /* 2. search the similarity matrix, get four of the most similar products of items */
    const recommendedIdArray = [];
    for (const productId in allProductList){
      recommendedIdArray.push(await getSimilarProducts(productId))
    }

    const flattenedArray = recommendedIdArray.flat();
    const recommendedIds = [...new Set(flattenedArray)];
    console.log("recommendedIds",recommendedIds)

    const queryConditions = {
      $and: [
        { productID: { $in: recommendedIds } },
        profileConditions
      ]
    };
    const ProfileList = await ProductSchema.find({
      ...profileConditions,
    })
    const productList = await ProductSchema.find({
      ...queryConditions,
    })

    /* 3. generate a list and store it into database */
    const recommendationList = productList.map(item => ({ productID: item.productID }));

    // if the recommendation list is not long enough, add some profile products
    while (recommendationList.length < 20 && ProfileList.length > 0) {
      const randomIndex = Math.floor(Math.random() * ProfileList.length);
      const randomProduct = ProfileList.splice(randomIndex, 1)[0]; // remove the random product
    
      // check if product already exists
      const isDuplicate = recommendationList.some(product => product.productID === randomProduct.productID);
      if (isDuplicate) {
        continue; // if duplicate, skip this product
      }

      recommendationList.push(randomProduct); // add random product to product list
    }
    
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

  const getSimilarProducts = async (itemId : string) => {
    const item = await ItemSimilarityMatrixSchema.findOne({
      productId : itemId,
    });
    const similarProducts = item ? item.matrixColumn || [] : [];
    const sortedProducts = similarProducts.sort((a, b) => b.similarity - a.similarity);
    const topFourProducts = sortedProducts.slice(0, 20);
    const topFourProductsIds = topFourProducts.map(product => product.productId);
    return topFourProductsIds;
  }

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
  function calculateCosineSimilarity(
    vector1: { [userId: string]: number },
    vector2: { [userId: string]: number }
  ): number {
    const dotProduct = calculateDotProduct(vector1, vector2);
    const magnitude1 = calculateMagnitude(vector1);
    const magnitude2 = calculateMagnitude(vector2);
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