import ShoppingCartSchema, { ShoppingCart } from "../models/shoppingcart";
import productItemSchema, { ProductItem } from "../models/productItem";
import ProductSchema, { ProductInterface } from "../models/product";

export const addOrder = async (
  shoppingCartID: string,
  orDelivery: string,
  orService: boolean,
  orAddressID: string
): Promise<String> => {
  console.log("fdd13411111111111qqq");
  return new Promise(async (resolve, reject) => {
    try {
      // if no address exist
      if (!orAddressID) {
        reject("Please add an shipping address");
        return;
      }

      //Else: 1. capacity management

      // const productItems = await productItemSchema.find({
      //   shoppingCartID: shoppingCartID,
      // }); 

      // // 遍历每个商品项
      // for (const productItem of productItems) {
      //   const { product, quantity } = productItem;

      //   // 更新库存
      //   const { productID } = product;
      //   const productDoc = await ProductSchema.findOne({ productID });

      //   // if (productDoc) {
      //   //   // 减去对应数量的库存
      //   //   productDoc.capacity -= quantity;
      //   //   await productDoc.save();
      //   // }
      // }

      //Else: 2. add usedUsers in Promo code

      //Else: 3. create Order

      resolve("success");
    } catch (err) {}
  });
};

// export const OrderSchema = new mongoose.Schema({
//   orderID: {
//     type: String,
//     required: true,
//   },
//   userID: {
//     type: String,
//     required: true,
//   },
//   orderDate: {
//     type: String,
//     required: true,
//   },
//   orderStatus: {
//     type: String,
//     required: true,
//   },
//   totalPrice: {
//     type: Number,
//     required: true,
//   },
//   orderProducts: {
//     type: {
//       shoppingCartID: {
//         type: String,
//         required: true,
//       },
//       product: {
//         type: {
//           productID: {
//             type: String,
//             required: true,
//           },
//           category: {
//             type: String,
//             required: false,
//           },
//           imageUrl: {
//             type: String,
//             required: false,
//           },
//           nutriScore: {
//             type: String,
//             required: false,
//           },
//           capacity: {
//             type: Number,
//             required: false,
//           },
//           productBrand: {
//             type: String,
//             required: false,
//           },
//           productPrice: {
//             type: Number,
//             required: false,
//           },
//           productName: {
//             type: String,
//             required: false,
//           },
//         },
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//       },
//     },
//     required: true,
//   },
//   trackingNumber: {
//     type: String,
//     required: true,
//   },
//   shipTo: {
//     type: {
//       userID: {
//         type: String,
//         required: true,
//       },
//       street: {
//         type: String,
//         required: true,
//       },
//       postCode: {
//         type: String,
//         required: true,
//       },
//       city: {
//         type: String,
//         required: true,
//       },
//       additionalAddress: {
//         type: String,
//         required: true,
//       },
//       tel: {
//         type: String,
//         required: true,
//       },
//       receiver: {
//         type: String,
//         required: true,
//       },
//     },
//     required: true,
//   },
// });
