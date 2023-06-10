import ProductDetailSchema, {
  ProductDetailInterface,
} from "../models/productDetail";
import { ProductInterface } from "../models/product";
import { findProductByID } from "./productService";
export const findDetailByID = async (
  id: string
): Promise<[ProductInterface | null, ProductDetailInterface | null] | null> => {
  console.log("in detail interface");
  const productDetail = await ProductDetailSchema.findOne({
    productID: id,
  });
  const product = await findProductByID(id);
  console.log(JSON.stringify(productDetail));
  if (product != null && productDetail == null) {
    return [product, null];
  } else if (product != null && productDetail != null) {
    return [product, productDetail];
  } else {
    return null;
  }
};
