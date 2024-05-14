import ProductSchema, { ProductInterface } from "../models/product";
import ProductDetailSchema from "../models/productDetail";

export const findAlternative = async (
  junkFoodType: string
): Promise<ProductInterface[] | null> => {
  /* common conditions of alternatives */
  const detail = await ProductDetailSchema.find({
    // $or: [
    //   { fatLevel: "low" },
    //   { sugarLevel: "low" }, 
    //   { saltLevel: "low" },
    // ],
    $nor: [
      { $and: [ { fatLevel: "high" }, { saltLevel : "high" }, { sugarLevel : "high" }]},
      // { $and: [ { fatLevel: "high" }, { saltLevel : "high" }]},
      // { $and: [ { fatLevel: "high" }, { sugarLevel : "high" }]},
      // { $and: [ { saltLevel: "high" }, { sugarLevel : "high" }]},
    ]
  });  
  const productIds = detail.map((productDetail)=> productDetail.productID);
  const commonConditions = {
    // nutriScore: { $in: ["A", "B", "C"] },
    // capacity: { $gt: 0 },
    productID: { $in: productIds }
  }
  /* 1. junk foof type : chips */
  if (junkFoodType === "0") {
    return getRandomizedAlternatives(await ProductSchema.find({
      ...commonConditions,
      category: "snacks",
      // $or: [ { productName: { $regex: "chip", $options: "i" } }, // including "chip" and case-insensitive e.g., fruit chips
      //        { productName: { $regex: "popcorn", $options: "i"  } },
      //        { productName: { $regex: "mais|rice", $options: "i"  } } // including "mais" or "rice" and case-insensitice e.g., some snacks made from mais
      //      ]
    }));
  } 
  /* 2. junk foof type : white chocolate */
  else if (junkFoodType === "1") {
    return getRandomizedAlternatives(await ProductSchema.find({
      ...commonConditions,
      // productName: { $regex: "choco|schoko|kakao", $options: "i"} // chocolate flavored items
    }));
  } 
  /* 3. junk food type: unhealthy beverages, e.g., coco-cola, which fat/salt Level is low and sugat level is high */
  else if (junkFoodType === "2") {
    // const betterNutrionProduct= await ProductDetailSchema.find({ 
    //    sugarLevel: { $ne: "high" },
    //    fatLevel: "low",
    //    saltLevel: "low"
    // });
    // const betterNutrionProductIds=betterNutrionProduct.map((productDetail)=> productDetail.productID);
    return getRandomizedAlternatives(await ProductSchema.find({
      ...commonConditions,
      category: "drinks",
      // productID: { $in: betterNutrionProductIds }
     }));
  }
  /* 4. junk foof type : gummi bears */
  else if (junkFoodType === "3") {
    // const sugarFreeProduct= await ProductDetailSchema.find({ sugar: 0.2 }); 
    // const sugarFreeProductIds=sugarFreeProduct.map((productDetail)=> productDetail.productID);
    return getRandomizedAlternatives(await ProductSchema.find({
      ...commonConditions,
      category: "snacks",
      // productID: { $in: sugarFreeProductIds }
    })); // sugar free snacks
  } 
  /* 5. junk food type: cookies which contain high amount of sugar and fat, such as Choco Leibniz */
  else if (junkFoodType === "4") {
    return getRandomizedAlternatives(await ProductSchema.find({
      ...commonConditions,
      category: "snacks",
      // productName: { $regex: "cookies|biscuits|knusperbrot|flapjack|riegel", $options: "i" } 
    }));
  } 
  /* 6. junk food type : high salt salami*/
  else{
    return getRandomizedAlternatives(await ProductSchema.find({
      ...commonConditions,
      category: { $in: ["snacks","staple"] },
      // productName: { $regex: "w[uü]rst|tofu", $options: "i" } 
     }));
  };
  } 

/* used to randomly return 4 alternatives */
const getRandomizedAlternatives = (alternativeList: ProductInterface[]): ProductInterface[] => {
  const random = alternativeList.sort(() => Math.random() - 0.5);
  return random.slice(0, 4);
};