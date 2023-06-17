import ShoppingCartSchema, { ShoppingCart } from "../models/shoppingcart";
import productItemSchema, { ProductItem } from "../models/productItem";
import BigNumber from "bignumber.js";

export const getShoppingCart = async (id: string) => {
  const shoppingCartItems = await ShoppingCartSchema.findOne({
    shoppingCartID: id,
  });

  const productItems = await productItemSchema.find({
    shoppingCartID: id,
  });

  const shoppingcartDetail = { shoppingCartItems, productItems };

  return shoppingcartDetail;
};

export const deleteProduct = async (
  //the passed data need to be divided, both shoppingCartID and productID are needed
  shoppingCartID: string,
  productID: string
): Promise<String> => {
  await productItemSchema
    .deleteMany({
      shoppingCartID: shoppingCartID,
      "product.productID": productID,
    })
    .catch(() => {
      return "error";
    });

  // update summary
  await calculateSummary(shoppingCartID).catch(() => {
    return "error";
  });
  return "success";
};

export const changeProductQuantity = async (
  //the passed data need to be divided, both shoppingCartID and productID are needed
  shoppingCartID: string,
  productID: string,
  quantity: number
): Promise<String> => {
  await productItemSchema
    .updateOne(
      { shoppingCartID: shoppingCartID, "product.productID": productID },
      { $set: { quantity: quantity } }
    )
    .catch(() => {
      return "error";
    });

  // update summary
  await calculateSummary(shoppingCartID).catch(() => {
    return "error";
  });

  return "success";
};

export const calculateSummary = async (shoppingCartID: string) => {
  const itemQuantity = await productItemSchema.countDocuments({
    shoppingCartID: shoppingCartID,
  });

  const productPrice = await productItemSchema.aggregate([
    {
      $match: { shoppingCartID: shoppingCartID },
    },
    {
      $group: {
        _id: null,
        totalPrice: {
          $sum: {
            $toDecimal: { $multiply: ["$product.productPrice", "$quantity"] },
          },
        },
      },
    },
  ]);

  let itemPrice = 0;
  if (productPrice.length === 1) {
    itemPrice = productPrice[0].totalPrice;
  } 

  //To do: find promo code
  const totalSaving = 5;

  const subTotal = new BigNumber(itemPrice)
    .minus(new BigNumber(totalSaving))
    .toString();  

  const result = await ShoppingCartSchema.updateOne(
    { shoppingCartID: shoppingCartID },
    {
      $set: {
        itemPrice: Number(itemPrice),
        totalSaving: Number(totalSaving),
        subTotal: Number(subTotal),
        itemQuantity: Number(itemQuantity),
      },
    }
  ).catch(() => {
    return "error";
  });
};
