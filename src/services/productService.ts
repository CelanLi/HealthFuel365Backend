import ProductSchema, { ProductInterface } from "../models/product";

export const findProductByName = async (
  text: string
): Promise<ProductInterface[] | null> => {
  // search database for product which start with text (case insensitive)
  const regexBeginn = RegExp("^" + text + "", "i");
  const productsBeginn = await ProductSchema.find({
    productName: regexBeginn,
  });
  let products = productsBeginn
    .sort((a: ProductInterface, b: ProductInterface) => {
      //@ts-ignore
      if (a.productName.length > b.productName.length) {
        return 1;
      }
      return -1;
    })
    .slice(0, 10);
  // search database for product which includes text (case insensitive)
  const regexIncludes = RegExp(".*" + text + ".*", "i");
  let productsIncludes = await ProductSchema.find({
    productName: regexIncludes,
  });
  products = products.concat(productsIncludes); //concat two strings, the products begin with the key words are at the front of the array.
  return products;
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
