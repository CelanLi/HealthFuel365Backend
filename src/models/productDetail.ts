import * as mongoose from "mongoose";
import {} from "./types";

export interface ProductDetailInterface extends mongoose.Document {
  productID: string;
  fatLevel?: string;
  sugarLevel?: string | undefined;
  saltLevel?: string;
  suagr?: number;
  fat?: number;
  salt?: string;
  productDescription: string;
}

export const ProductDetailSchema = new mongoose.Schema({
  // used to create collections, generated at the time request processing
  productID: {
    type: String,
    required: true,
  },
  fatLevel: {
    type: String,
    required: false,
  },
  suagrLevel: {
    type: String,
    required: false,
  },
  saltLevel: {
    type: String,
    required: false,
  },
  fat: {
    type: String,
    required: false,
  },
  sugar: {
    type: Number,
    required: false,
  },
  salt: {
    type: String,
    required: false,
  },
  productDescription: {
    type: String,
    required: false,
  },
});
/* This maps the internal id of the product
 created by mongoose to the field id when accessed via to JSON */
ProductDetailSchema.virtual("id").get(function () {
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

ProductDetailSchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.model<ProductDetailInterface>(
  "ProductDetail",
  ProductDetailSchema
);
