import ShoppingCartchema, { ShoppingCart } from "../models/shoppingcart";
import productItemSchema, { ProductItem } from "../models/productItem";
export const getShoppingCart = async (
  id: string
): Promise<ProductItem[] | null> => {
  const shoppingCartItems = await productItemSchema.find({
    shoppingCartID: id,
  });
  return shoppingCartItems;
};
export const deleteProductItem = async (
  //the passed data need to be divided, both shoppingCartID and productID are needed
  id: string
): Promise<ProductItem[] | null> => {
  const shoppingCartItems = await productItemSchema.find({
    shoppingCartID: id,
  });
  return shoppingCartItems;
};
