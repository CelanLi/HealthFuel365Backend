import * as mongoose from "mongoose";
import { ProductInterface } from "./product";

export interface ProductItem extends mongoose.Document {
  shoppingCartID: string;
  product: ProductInterface;
  quantity: number;
}

export const ProductItemSchema = new mongoose.Schema({
  // used to create collections, generated at the time request processing
  shoppingCartID: {
    type: String,
    required: true,
  },
  product: {
    type: 
      {
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
});
/* This maps the internal id of the product
 created by mongoose to the field id when accessed via to JSON */
ProductItemSchema.virtual("id").get(function () {
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

ProductItemSchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.model<ProductItem>("ProductItem", ProductItemSchema);

 