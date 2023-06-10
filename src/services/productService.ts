import ProductSchema, { ProductInterface } from "../models/product";

export const findProductByName = async (
  text: string
): Promise<ProductInterface[] | null> => {
  // search database for product which includes text
  const regexIncludes = RegExp(".*" + text + ".*", "i");
  let productsIncludes = await ProductSchema.find({
    productName: regexIncludes,
  });
  return productsIncludes;
};

export const findProductByCategory = async (
  category: string
): Promise<ProductInterface[] | null> => {
  const products = await ProductSchema.find({
    category: category,
  });
  return products;
};
export const findAllProducts = async (): Promise<ProductInterface[] | null> => {
  const products = await ProductSchema.find();
  return products;
};
export const findProductByID = async (
  id: string
): Promise<ProductInterface | null> => {
  const product = await ProductSchema.findOne({
    productID: id,
  });
  return product;
};
