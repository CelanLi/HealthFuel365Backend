import * as mongoose from "mongoose";

export interface ProductDetailInterface extends mongoose.Document {
  productID: string;
  fatLevel?: string;
  sugarLevel?: string | undefined;
  saltLevel?: string;
  sugar?: number;
  fat?: number;
  salt?: number;
  vegan?: boolean;
  vegetarian?: boolean;
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
  sugarLevel: {
    type: String,
    required: false,
  },
  saltLevel: {
    type: String,
    required: false,
  },
  fat: {
    type: Number,
    required: false,
  },
  sugar: {
    type: Number,
    required: false,
  },
  salt: {
    type: Number,
    required: false,
  },
  vegan: {
    type: Boolean,
    required: false,
  },
  vegetarian:  {
    type: Boolean,
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