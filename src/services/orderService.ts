import ShoppingCartSchema from "../models/shoppingcart";
import productItemSchema from "../models/productItem";
import ProductSchema from "../models/product";
import PromoCodeSchema from "../models/promocode";
import AddressSchema from "../models/address";
import OrderSchema, { OrderInterface } from "../models/order";
import { calculateSummary } from "./shoppingCartService";
import BigNumber from "bignumber.js";

export const addOrder = async (
  shoppingCartID: string,
  orDelivery: string,
  orService: boolean,
  orAddressID: string
): Promise<String> => {
  return new Promise(async (resolve, reject) => {
    try {
      // if no address exist
      if (!orAddressID) {
        reject("Please add an shipping address");
        return;
      }

      // Else: 1. capacity management
      const productItems = await productItemSchema.find({
        shoppingCartID: shoppingCartID,
      });
 

      for (const productItem of productItems) {
        const { product, quantity } = productItem;
        const { productID } = product;
        const productDoc = await ProductSchema.findOne({ productID });

        if (productDoc && productDoc.capacity) {
          if (productDoc.capacity < quantity) {
            reject(
              "Sorry, The quantity of the selected item exceeds its capacity."
            );
            return;
          }
          productDoc.capacity -= quantity;
          await productDoc.save();
        }
      }

      const shoppingCart = await ShoppingCartSchema.findOne({ shoppingCartID });

      if (!shoppingCart) {
        reject("Sorry, The shopping cart is not found.");
        return;
      }

      // Else: 2. add usedUsers in Promo code
      const { codeValue } = shoppingCart;
      const promoCode = await PromoCodeSchema.findOne({ code: codeValue });
      if (promoCode) {
        // userID=shoppingCartID
        promoCode.usedUser.push(shoppingCartID);
        await promoCode.save();
      }

      // Else: 3. clear shopping cart
      await productItemSchema.deleteMany({ shoppingCartID });
      await calculateSummary(shoppingCartID);

      // Else: 4. create Order
      const address = await AddressSchema.findOne({ _id: orAddressID });

      const shippingPrice = orDelivery === "Rapid" ? 7.95 : 4.95;
      const servicePrice = orService ? 1.95 : 0;
      const totalPrice = new BigNumber(shoppingCart.subTotal)
        .plus(new BigNumber(shippingPrice))
        .plus(new BigNumber(servicePrice)).toNumber();

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const date = currentDate.getDate();

      const newOrder = new OrderSchema(); 

      const order = {
        orderID: newOrder._id,
        userID: shoppingCartID,
        orderDate: year + "-" + month + "-" + date,
        orderStatus: "Processing",
        totalPrice: totalPrice,
        orderProducts: productItems,
        trackingNumber: "-",
        shipTo: address,
      };

      console.log(order);

      try {
        await OrderSchema.create(order);
      } catch (err) {
        console.log(err);
      }

      resolve("success");
    } catch (err) {}
  });
};

export const findOrderByUser = async (
  userID: string
): Promise<OrderInterface[] | null> => {
  const orders = await OrderSchema.find({
    userID: userID,
  });
  console.log("orders=",orders)
  return orders;
};
