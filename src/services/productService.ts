import { error } from "jquery";
import ProductSchema, { ProductInterface } from "../models/product";
import ProductItemSchema from "../models/productItem";
import { calculateSummary } from "./shoppingCartService";

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

export const addToShoppingCart = async (
  shoppingCartID: string,
  productID: string
) => {
  const query = {
    shoppingCartID: shoppingCartID,
    "product.productID": productID,
  };
  const update = { $inc: { quantity: 1 } };
  const options = { new: true };
  //options {new: false} => return the original doc, options {new: true} return the updated docs
  const productItem = await ProductItemSchema.findOne(query); //current quantity of a certain product in the shoppingcart
  const product = await ProductSchema.findOne({ productID: productID });
  if (!productItem) {
    const createdProductItem = await ProductItemSchema.create({
      shoppingCartID: shoppingCartID,
      product: product,
      quantity: 1,
    });
    // update summary
    await calculateSummary(shoppingCartID).catch(() => {
      return "error";
    });
    return createdProductItem;
  } else {
    if (productItem?.quantity < (product?.capacity ?? 0)) {
      const updatedCartItem = await ProductItemSchema.findOneAndUpdate(
        query,
        update,
        options
      );
      // update summary
      await calculateSummary(shoppingCartID).catch(() => {
        return "error";
      });
      return updatedCartItem;
    } else {
      throw new Error(
        "Sorry, there're only " + product?.capacity + " items available"
      );
    }
  }
};
