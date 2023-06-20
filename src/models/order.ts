import * as mongoose from "mongoose";
import { OrderStatus, IAddress, ProductItem } from "./types";

export interface OrderInterface extends mongoose.Document {
  //interface of mongoose model
  orderID: string;
  orderDate: Date;
  orderStatus: OrderStatus;
  totalPrice: number;
  orderProducts: ProductItem[];
  trackingNumber: string;
  shipTo: IAddress;
}

export const OrderSchema = new mongoose.Schema({
  orderID: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  orderDate: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  orderProducts: {
    type: {
      shoppingCartID: {
        type: String,
        required: true,
      },
      product: {
        type: {
          productID: {
            type: String,
            required: true,
          },
          category: {
            type: String,
            required: false,
          },
          imageUrl: {
            type: String,
            required: false,
          },
          nutriScore: {
            type: String,
            required: false,
          },
          capacity: {
            type: Number,
            required: false,
          },
          productBrand: {
            type: String,
            required: false,
          },
          productPrice: {
            type: Number,
            required: false,
          },
          productName: {
            type: String,
            required: false,
          },
        },
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
    required: true,
  },
  trackingNumber: {
    type: String,
    required: true,
  },
  shipTo: {
    type: {
      userID: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      postCode: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      additionalAddress: {
        type: String,
        required: true,
      },
      tel: {
        type: String,
        required: true,
      },
      receiver: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
});
/* This maps the internal id of the profile
 created by mongoose to the field id when accessed via to JSON */
OrderSchema.virtual("id").get(function () {
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

OrderSchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.model<OrderInterface>("Order", OrderSchema);
