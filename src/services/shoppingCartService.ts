import ShoppingCartchema, { ShoppingCart } from "../models/shoppingcart";
import productItemSchema, { ProductItem } from "../models/productItem";

export const getShoppingCart = async (id: string) => {
  const shoppingCartItems = await ShoppingCartchema.findOne({
    shoppingCartID: id,
  });

  const productItems = await productItemSchema.find({
    shoppingCartID: id,
  });

  const shoppingcartDetail = { shoppingCartItems, productItems };

  return shoppingcartDetail;
};

// // 待完成
// export const deleteProductItem = async (
//   //the passed data need to be divided, both shoppingCartID and productID are needed
//   id: string
// ): Promise<ProductItem[] | null> => {
//   const shoppingCartItems = await productItemSchema.find({
//     shoppingCartID: id,
//   });
//   return shoppingCartItems;
// };

// // 待完成
// export const changeProductCount = async (
//   //the passed data need to be divided, both shoppingCartID and productID are needed
//   id: string
// ): Promise<ProductItem[] | null> => {
//   const shoppingCartItems = await productItemSchema.find({
//     shoppingCartID: id,
//   });
//   return shoppingCartItems;
// };
