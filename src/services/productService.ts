import ProductSchema, { ProductInterface } from "../models/product";

export const findProductByName = async (
  text: string,
  selectedSort: string
): Promise<ProductInterface[] | null> => {
  // search database for product which includes text
  const regexIncludes = RegExp(".*" + text + ".*", "i");
  if (selectedSort === "1") {
    console.log(selectedSort + "selected sort");
    return await ProductSchema.find({
      productName: regexIncludes,
    }).sort({ nutriScore: 1 });
  } else if (selectedSort === "2") {
    console.log(selectedSort + "selected sort");
    return await ProductSchema.find({
      productName: regexIncludes,
    }).sort({ productName: 1 });
  } else if (selectedSort === "3") {
    console.log(selectedSort + "selected sort");
    return await ProductSchema.find({
      productName: regexIncludes,
    }).sort({ productPrice: 1 });
  } else {
    console.log(selectedSort + "selected sort");
    return await ProductSchema.find({
      productName: regexIncludes,
    }).sort({ productPrice: -1 });
  }
};

export const findProductByCategory = async (
  category: string
): Promise<ProductInterface[] | null> => {
  const products = await ProductSchema.find({
    category: category,
  });
  return products;
};
export const findAllProducts = async (
  selectedSort: string
): Promise<ProductInterface[] | null> => {
  if (selectedSort === "1") {
    return await sortProductsByNutriscore();
  } else if (selectedSort === "2") {
    return await sortProductsByName();
  } else if (selectedSort === "3") {
    return await sortProductsPriceAscending();
  } else {
    return await sortProductsPriceDescending();
  }
};
export const findProductByID = async (
  id: string
): Promise<ProductInterface | null> => {
  const product = await ProductSchema.findOne({
    productID: id,
  });
  return product;
};

export const sortProductsByNutriscore = async (): Promise<
  ProductInterface[] | null
> => {
  const products = await ProductSchema.find().sort({ nutriScore: 1 });
  return products;
};
export const sortProductsPriceAscending = async (): Promise<
  ProductInterface[] | null
> => {
  const products = await ProductSchema.find().sort({ productPrice: 1 });
  return products;
};
export const sortProductsPriceDescending = async (): Promise<
  ProductInterface[] | null
> => {
  const products = await ProductSchema.find().sort({ productPrice: -1 });
  return products;
};
export const sortProductsByName = async (): Promise<
  ProductInterface[] | null
> => {
  const products = await ProductSchema.find().sort({ productName: 1 });
  return products;
};
