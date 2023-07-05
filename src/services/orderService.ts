import ShoppingCartSchema from "../models/shoppingcart";
import productItemSchema from "../models/productItem";
import ProductSchema from "../models/product";
import PromoCodeSchema, {Promocode} from "../models/promocode";
import PackageAndShippingServiceSchema, {PackageAndShippingServiceInterface} from "../models/packageAndShippingService";
import AddressSchema from "../models/address";
import OrderSchema, { OrderInterface } from "../models/order";
import PaymentSchema, {PaymentInterface} from "../models/payment";
import { calculateSummary } from "./shoppingCartService";
import BigNumber from "bignumber.js";
import payment from "../models/payment";

export const addOrder = async (
  shoppingCartID: string,
  orDelivery: string,
  orService: boolean,
  orAddressID: string,
  paymentID: string
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
        .plus(new BigNumber(servicePrice))
        .toNumber();

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const date = currentDate.getDate();
      const localDateString = currentDate.toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });
      const newOrder = new OrderSchema(); 
      const order = {
        orderID: newOrder._id,
        userID: shoppingCartID,
        orderDate: localDateString,
        // year + "-" + month + "-" + date,
        orderStatus: "Processing",
        totalPrice: totalPrice,
        orderProducts: productItems,
        trackingNumber: "-",
        shipTo: address,

        itemPrice: shoppingCart.itemPrice,
        totalSaving: shoppingCart.totalSaving,
        subTotal: shoppingCart.subTotal,
        itemQuantity: shoppingCart.itemQuantity,
        codeValue: codeValue,
      };

      console.log(orDelivery, orService);
      const service = {
        orderID: newOrder._id,
        // orDelivery: DHL/HERMES/Rapid
        //HERMES <= isDHL & rapidShipping: FALSE
        isDHL: orDelivery === "DHL",
        rapidShipping: orDelivery === "Rapid",
        sendAsAGift: orService,
      };

      
      const payment = {
        orderID: newOrder._id,
        paymentID: paymentID,
        paid: year + "-" + month + "-" + date,
      };

      try {
        await OrderSchema.create(order);
        await PackageAndShippingServiceSchema.create(service);
        await PaymentSchema.create(payment);
      } catch (err) {
        console.log(err);
      }
      resolve("success");
    } catch (err) {}
  });
};

export const cancelPayPal = async (paymentID: string) => {
  const payment = await PaymentSchema.findOne({
    paymentID: paymentID,
  });
  if (!payment) {
    return "";
  }
  const { orderID } = payment;
  await OrderSchema.updateOne(
    { orderID: orderID },
    { $set: { orderStatus: "Cancelled" } }
  ).catch(() => {
    return "error";
  });

  await PaymentSchema
  .deleteMany({
    paymentID: paymentID, 
  })
  .catch(() => {
    return "error";
  });
};

export const successPayPal = async (paymentID: string) => {
  const payment = await PaymentSchema.findOne({
    paymentID: paymentID,
  });
  if (!payment) {
    return "";
  }
  const { orderID } = payment;
  await OrderSchema.updateOne(
    { orderID: orderID },
    { $set: { orderStatus: "Processing" } }
  ).catch(() => {
    return "error";
  });
};

export const findOrderByUser = async (
  userID: string
): Promise<OrderInterface[] | null> => {
  const orders = await OrderSchema.find({
    userID: userID,
  });
  console.log("orders=", orders);
  return orders;
};

export const findOrderById = async (
  orderID: string
): Promise<OrderInterface | null> => {
  const orders = await OrderSchema.findOne({
    orderID: orderID,
  });
  return orders;
};

export const findServicesByOrderId = async (
  orderID: string
): Promise<PackageAndShippingServiceInterface | null> => {
  const services = await PackageAndShippingServiceSchema.findOne({
    orderID: orderID,
  });
  return services;
};

export const findPaymentByOrderId = async (
  orderID: string
): Promise<PaymentInterface | null> => {
  const payment = await PaymentSchema.findOne({
    orderID: orderID,
  });
  return payment;
};

export const findPromododeByCode = async (
  code: string
): Promise<Promocode | null> => {
  const promocode = await PromoCodeSchema.findOne({
    code: code,
  });
  return promocode;
};

export const getAllOrders = async (): Promise<OrderInterface[]> => {
  try {
    const orders = await OrderSchema.find({});

    return orders;
  } catch (error) {
    throw new Error("Failed to retrieve orders");
  }
};