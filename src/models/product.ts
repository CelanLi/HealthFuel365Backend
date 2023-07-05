import * as mongoose from "mongoose";
import {} from "./types";

export interface ProductInterface extends mongoose.Document {
  productID: string;
  category: string;
  imageUrl: string;
  nutriScore: string | undefined;
  capacity: number;
  productBrand: string;
  productPrice: number;
  productName: string;
}

export const ProductSchema = new mongoose.Schema({
  // used to create collections, generated at the time request processing
  productID: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  nutriScore: {
    type: String,
    required: false,
  },
  capacity: {
    type: Number,
    required: true,
  },
  productBrand: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
});
/* This maps the internal id of the product
 created by mongoose to the field id when accessed via to JSON */
ProductSchema.virtual("id").get(function () {
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

ProductSchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.model<ProductInterface>("Product", ProductSchema);
