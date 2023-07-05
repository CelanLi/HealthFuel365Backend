import Userschema, { User } from "../models/user";
import ProfileSchema, { ProfileInterface } from "../models/profile";
import PromoCodeSchema, { Promocode } from "../models/promocode";
import OrderSchema, { OrderInterface } from "../models/order";
import PackageAndShippingServiceSchema, {
  PackageAndShippingServiceInterface,
} from "../models/packageAndShippingService";
import Productschema, { ProductSchema } from "../models/product";
import ProductDetail from "../models/productDetail";

export const findAllUsersWithProfiles = async (
  keyWords: string): Promise<
  [User[], ProfileInterface[]] | null
> => {
  let users: User[] = [];
  if (keyWords === "") {
    users = await Userschema.find();
  } else {
    users = await Userschema.find({   
      username: { $regex: keyWords, $options: "i" },
    });
  }
  // Extract user IDs
  const userIDs = users.map((user) => user._id);
  // Find corresponding profiles
  const profiles = await ProfileSchema.find({ userID: { $in: userIDs } });
  return [users, profiles];
};

export const deleteUser = async (userID: string) => {
  await Userschema.findByIdAndDelete(userID);
  await ProfileSchema.findOneAndDelete({ userID: userID });
};

export const updateEmail = async (userID: string, email: string) => {
  await Userschema.findOneAndUpdate(
    { _id: userID },
    { $set: { email: email } }
  );
};

export const findAllPromoCodes = async (
  keyWords: string
): Promise<Promocode[] | null> => {
  let promoCodes = [];
  if (!keyWords) {
    promoCodes = await PromoCodeSchema.find();
  } else {
    promoCodes = await PromoCodeSchema.find({
      code: { $regex: keyWords, $options: "i" },
    });
  }
  return promoCodes;
};

export const removePromoCode = async (promoCodeID: string) => {
  await PromoCodeSchema.findOneAndDelete({ _id: promoCodeID });
};

export const createPromoCode = async (
  code: string,
  expirationDate: Date,
  discountRate: Number,
  minThreshold: Number
): Promise<String> => {
  return new Promise(async (resolve, reject) => {
    try {
      //edit name must different from existing promocode name
      const promoCodes = await PromoCodeSchema.find({ code: code }).exec();

      if (promoCodes.length > 0) {
        reject(
          "Sorry, the promoCode with this name can not be created, because the input name has already exist."
        );
        return;
      }

      const newPromoCode = new PromoCodeSchema({
        code,
        expirationDate,
        discountRate,
        minThreshold,
      });

      await newPromoCode.save().catch(() => {
        return "error";
      });

      resolve("success");
    } catch (err) {}
  });
};

export const editPromoCode = async (
  promoCodeID: string,
  code: string,
  expirationDate: Date,
  discountRate: Number,
  minThreshold: Number
): Promise<String> => {
  return new Promise(async (resolve, reject) => {
    try {
      //edit name must different from existing promocode name
      const promoCodes = await PromoCodeSchema.find({
        $and: [{ _id: { $ne: promoCodeID } }, { code: code }],
      }).exec();

      if (promoCodes.length > 0) {
        await PromoCodeSchema.findOneAndUpdate(
          { _id: promoCodeID },
          {
            $set: {
              expirationDate: expirationDate,
              discountRate: discountRate,
              minThreshold: minThreshold,
            },
          }
        ).catch(() => {
          return "error";
        });

        reject(
          "Sorry, the promoCode Name will not changed, because the input name has already exist."
        );
        return;
      }

      await PromoCodeSchema.findOneAndUpdate(
        { _id: promoCodeID },
        {
          $set: {
            code: code,
            expirationDate: expirationDate,
            discountRate: discountRate,
            minThreshold: minThreshold,
          },
        }
      ).catch(() => {
        return "error";
      });

      resolve("success");
    } catch (err) {}
  });
};

export const findAllOrdersWithService = async (
  keyWords: string
): Promise<[OrderInterface[], PackageAndShippingServiceInterface[]]> => {
  try {
    let orders: OrderInterface[] = [];
    if (keyWords === "") {
      orders = await OrderSchema.find();
    } else {
      orders = await OrderSchema.find({
        orderID: { $regex: keyWords, $options: "i" },
      });
    }
    // extract order IDS
    const orderIDs = orders.map((order) => order.orderID);
    // find corresponding services
    const services = await PackageAndShippingServiceSchema.find({
      orderID: { $in: orderIDs },
    });
    return [orders, services];
  } catch (error) {
    throw new Error("Failed to retrieve orders");
  }
};

export const editOrder = async (
  orderID: string,
  status: string,
  trackingnumber: string
) => {
  // const userIdItem = await OrderSchema.findOne({ orderID: orderID }, "userID");

  // const codeItem = await OrderSchema.findOne({ orderID: orderID }, "codeValue");

  // if (!codeItem || !userIdItem) {
  //   return;
  // }

  // const { codeValue } = codeItem;

  // if (status === "Cancelled" && codeValue) {
  //   try {
  //     await PromoCodeSchema.updateOne(
  //       { code: codeValue },
  //       { $pull: { usedUser: userIdItem?.userID } }
  //     );
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  await OrderSchema.findOneAndUpdate(
    { orderID: orderID },
    { $set: { orderStatus: status, trackingNumber: trackingnumber } }
  );
};

export const findOrderById = async (
  orderID: string
): Promise<OrderInterface | null> => {
  const order = await OrderSchema.findOne({
    orderID: orderID,
  });
  console.log(order);
  return order;
};

export async function findProductsWithDetails() {
  const products = await Productschema.find();
  const productIDs = products.map((product) => product.productID);
  // Find corresponding profiles
  const details = await ProductDetail.find({ productID: { $in: productIDs } });
  return [products, details];
}

export async function findProductWithDetail(productID: string) {
  const product = await Productschema.findOne({ productID: productID });
  const detail = await ProductDetail.findOne({ productID: productID });
  return [product, detail];
}

export async function removeProduct(productID: string) {
  const result1 = await Productschema.deleteOne({ productID: productID });
  const result2 = await ProductDetail.deleteOne({ productID: productID });
  console.log(JSON.stringify(result1));
  return result1;
}

export async function postProduct(
  productID: string,
  category: string,
  imageUrl: string,
  nutriScore: string | undefined,
  capacity: number,
  productBrand: string,
  productPrice: number,
  productName: string
) {
  const createdProduct = await Productschema.create({
    productID: productID,
    category: category,
    imageUrl: imageUrl,
    nutriScore: nutriScore,
    capacity: capacity,
    productBrand: productBrand,
    productPrice: productPrice,
    productName: productName,
  });
  return createdProduct;
}
