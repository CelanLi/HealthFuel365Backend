import {
  imageServer,
  imageServiceURI,
  openFoodFactsProductUri,
} from "../config";
import ProductSchema, { ProductInterface } from "../models/product";

export const resolveProduct = async (
  productname: string
): Promise<ProductInterface[] | null> => {
  const product = await ProductSchema.find({
    receiptNames: {
      $all: [productname],
    },
  });
  return product;
};

export const findProductByName = async (
  text: string
): Promise<ProductInterface[] | null> => {
  // search own database for product which start with text (case insensitive)
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

  if (products.length < 10) {
    // search own database for product which includes text (case insensitive)
    const regexIncludes = RegExp(".*" + text + ".*", "i");
    let productsIncludes = await ProductSchema.find({
      productName: regexIncludes,
    });

    productsIncludes = productsIncludes.slice(0, 10);

    // filter already included products out
    const p = productsIncludes.filter(
      (product) => products.filter((p) => p.id == product.id).length == 0
    );
    // append to array
    products = products.concat(p);
  }
  // return first 10 elements
  return products.slice(0, 10);
};
