import { Query,FilterQuery } from "mongoose";
import ProductSchema, { ProductInterface } from "../models/product";
import ProductDetailSchema, { ProductDetailInterface } from "../models/productDetail";

import { getProfile } from "./userService";
import { getAllOrders } from "./orderService";
import order, { OrderSchema } from "../models/order";
import user from "../models/user";


// for guest users
export const findRecommendations = async (

): Promise<ProductInterface[] | null> => {
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

// for users already have a profile
export const findRecommendationsWithCookies = async (
    _id: string
  ): Promise<ProductInterface[] | null> => {
    console.log("user: " + _id );
    /* common conditions of recommendations */
    const detail1 = await ProductDetailSchema.find({
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
    const productIds1 = detail1.map((productDetail)=> productDetail.productID);
    const commonConditions = {
      nutriScore: { $in: ["A", "B", "C"] },
      capacity: { $gt: 0 },
      productID: { $in: productIds1 }
    }
    /* 1. if user is a guest, return randomized products  */
    //TODO: maybe some popular products should be recommended to customers
    if (!_id) {
        return getRandomizedRecommendations(await ProductSchema.find({
            ...commonConditions,
        }))
    };

    /* 2. if user has logged in, and has a profile, recommendations should be made according to his preferences */
    const profile = await getProfile(_id);
    console.log(profile,"userprofile")

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
    console.log(productIds2)
    const profileConditions = {
      nutriScore: { $in: profile?.nutriPreference },
      capacity: { $gt: 0 },
      productID: { $in: productIds2 }
    }

    /* 3. if the order list is not null, then we would recommand products according to brands, similar products and so on */
    const records = await getPurchaseRecord();
    const itemUserMatrix = calculateItemUserMatrix(records);
    const similarityMatrix = calculateItemSimilarityMatrix(itemUserMatrix);

    // get user purchased products from records
    const userPurchasedProductsIds = records
    .filter(record => record.userId === _id)
    .map(record => record.productId);

    // get recommended products'id list
    const recommendedIdArray = [];
    for (const userPurchasedProductsId in userPurchasedProductsIds){
      recommendedIdArray.push(getTopTwoSimilarProductsIds(userPurchasedProductsId, similarityMatrix))
    }
    const flattenedArray = recommendedIdArray.flat();
    const recommendedIds = [...new Set(flattenedArray)];
    console.log(recommendedIds)

    // build query conditions according to recommendations
    const queryConditions = {
      recommendedIds: { $in: recommendedIds },
      ...profileConditions
    };

    const ProfileList = await ProductSchema.find({
      ...profileConditions,
    })

    const productList = await ProductSchema.find({
      ...queryConditions,
    })

    // if there are more than 12 products, randomly select 12 of them
    if (productList.length >= 12) {
      return getRandomizedRecommendations(productList)
    }
    // else, get some other products to return 12 products
    while (productList.length < 12 && ProfileList.length > 0) {
      const randomIndex = Math.floor(Math.random() * ProfileList.length);
      const randomProduct = ProfileList.splice(randomIndex, 1)[0]; // remove the random product
    
      // check if product already exists
      const isDuplicate = productList.some(product => product.productID === randomProduct.productID);
      if (isDuplicate) {
        continue; // if duplicate, skip this product
      }

      productList.push(randomProduct); // add random product to product list
    }
    return productList;
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
  const calculateItemUserMatrix = (purchaseRecords: PurchaseRecord[]): ItemUserMatrix => {
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

  /* define similarity Matrix */
  interface ItemSimilarity {
    itemId: string;
    similarity: number;
  }
  
  interface ItemSimilarityMatrix {
    [itemId: string]: ItemSimilarity[];
  };

  /* calculate the cosine similarity between items */
  const calculateItemSimilarityMatrix = (itemUserMatrix: ItemUserMatrix): ItemSimilarityMatrix => {
    const itemIds = Object.keys(itemUserMatrix);
    const itemSimilarityMatrix: ItemSimilarityMatrix = {};
  
    for (let i = 0; i < itemIds.length; i++) {
      const itemId1 = itemIds[i];
      itemSimilarityMatrix[itemId1] = [];
  
      for (let j = 0; j < itemIds.length; j++) {
        if (i === j) {
          continue; // Skip comparing an item with itself
        }
  
        const itemId2 = itemIds[j];
        const similarity = calculateCosineSimilarity(itemUserMatrix[itemId1], itemUserMatrix[itemId2]);
        
        itemSimilarityMatrix[itemId1].push({ itemId: itemId2, similarity });
      }
    }
  
    return itemSimilarityMatrix;
  };

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

  /* sort products by similarity, and get the top two products with highest similarity */
  const getTopTwoSimilarProductsIds = (itemId : string, similarityMatrix : ItemSimilarityMatrix) => {
    const similarProducts = similarityMatrix[itemId] || [];
    const sortedProducts = similarProducts.sort((a, b) => b.similarity - a.similarity);
    const topTwoProducts = sortedProducts.slice(0, 2);
    const topTwoProductsIds = topTwoProducts.map(product => product.itemId);
    return topTwoProductsIds;
  };