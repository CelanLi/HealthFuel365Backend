import ProductSchema, { ProductInterface } from "../models/product";
import ProductDetailSchema from "../models/productDetail";

export const findAlternative = async (
 /* to do: randomization*/
  junkFoodType: string
): Promise<ProductInterface[] | null> => {
  console.log("selected item: " + junkFoodType );
  /* common conditions of alternatives */
  const detail = await ProductDetailSchema.find({
    $or: [
      { fatLevel: "small" },
      { sugarLevel: "small" }, 
      { saltLevel: "small" },
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
  /* 1. junk foof type : chips */
  if (junkFoodType === "0") {
    return await ProductSchema.find({
      ...commonConditions,
      category: "snacks",
      $or: [ { productName: { $regex: "chip", $options: "i" } }, // including "chip" and case-insensitive e.g., fruit chips
             { productName: { $regex: "mais", $options: "i"  } } // including "mais" and case-insensitice e.g., some snacks made from mais
           ]
    }).limit(4); //Limit the number of alternative product to 4
  } 
  /* 2. junk foof type : white chocolate */
  else if (junkFoodType === "1") {
    return await ProductSchema.find({
      ...commonConditions,
      productName: { $regex: "choco|schoko", $options: "i"} // chocolate flavored items
    }).limit(4);
  } 
  else if (junkFoodType === "2") {
    return await ProductSchema.find({
      ...commonConditions,
      /* to do*/
    }).limit(4);
  } 
  /* 4. junk foof type : gummi bears */
  else if (junkFoodType === "3") {
    const sugarFreeProduct= await ProductDetailSchema.find({ sugar: 0 }).select("productID");  
    const sugarFreeProductIds=sugarFreeProduct.map((productDetail)=> productDetail.productID);
    return await ProductSchema.find({
      ...commonConditions,
      category: "snacks",
      productID: { $in: sugarFreeProductIds }
    }).limit(4);
  } 
  else if (junkFoodType === "4") {
    return await ProductSchema.find({
      ...commonConditions,
      /* to do*/
    }).limit(4);
  } 
  else return await ProductSchema.find({
    ...commonConditions,
     /* to do*/
   }).limit(4);
};
