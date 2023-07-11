import ShoppingCartSchema, { ShoppingCart } from "../models/shoppingcart";
import productItemSchema, { ProductItem } from "../models/productItem";
import PromoCodeSchema from "../models/promocode";
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

export const validatePromoCode = async (
  shoppingCartID: string,
  code: string
): Promise<String> => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await PromoCodeSchema.findOne({ code });

      // 1.if promo code exist  2.expiration time  3.user already used
      const itemQuantityObject = await ShoppingCartSchema.findOne(
        { shoppingCartID },
        "itemQuantity"
      ); 

      if (itemQuantityObject && Number(itemQuantityObject.itemQuantity)===0){
        reject("Sorry, your shopping cart is empty.");
        return;
      }
      else if (!res) {
        reject("No corresponding promo code found");
        return;
      } else if (+new Date(res.expirationDate) < +new Date()) {
        reject("Sorry, this Promo Code is already expired.");
        return;
      } else if (res.usedUser.includes(shoppingCartID)) {
        reject(
          "Sorry, You have already used it. Promo code can only be used once."
        );
        return;
      }

      // 4.min Threshold
      const priceObject = await ShoppingCartSchema.findOne(
        { shoppingCartID },
        "itemPrice"
      );
      if (priceObject && Number(priceObject.itemPrice) < res.minThreshold) {
        reject("Sorry, promo code usage threshold not reached.");
        return;
      }

      // add code into shoppingcartschema
      await ShoppingCartSchema.updateOne(
        { shoppingCartID: shoppingCartID },
        { $set: { codeValue: code } }
      ).catch(() => {
        return "error";
      });

      // update summary
      await calculateSummary(shoppingCartID).catch(() => {
        return "error";
      });
      resolve("success");
    } catch (err) {}
  });
};

export const removePromoCode = async (
  shoppingCartID: string
): Promise<String> => {
  await ShoppingCartSchema.updateOne(
    { shoppingCartID: shoppingCartID },
    { $set: { codeValue: "" } }
  ).catch(() => {
    return "error";
  });

  // update summary
  await calculateSummary(shoppingCartID).catch(() => {
    return "error";
  });
  return "success";
};

// summary calculate
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

  //if itemPrice not over min threshold of the promo code
  const codeCheck = await ShoppingCartSchema.findOne(
    { shoppingCartID },
    "codeValue"
  );

  if (codeCheck) {
    const minThreshold = await PromoCodeSchema.findOne(
      { code: codeCheck.codeValue },
      "minThreshold"
    );

    if (minThreshold && itemPrice < minThreshold.minThreshold) {
      await ShoppingCartSchema.updateOne(
        { shoppingCartID: shoppingCartID },
        { $set: { codeValue: "" } }
      ).catch(() => {
        return "error";
      });
    }
  }

  const codeObject = await ShoppingCartSchema.findOne(
    { shoppingCartID },
    "codeValue"
  );

  let totalSaving = 0;

  if (codeObject) {
    // calculate totalsavings
    const discountRate = await PromoCodeSchema.findOne(
      { code: codeObject.codeValue },
      "discountRate"
    );

    if (discountRate) {
      totalSaving = new BigNumber(
        new BigNumber(itemPrice)
          .times(
            new BigNumber(1).minus(new BigNumber(discountRate.discountRate))
          )
          .toFixed(2)
      ).toNumber();
    }
  }

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
