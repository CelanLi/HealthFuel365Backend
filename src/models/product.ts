import * as mongoose from "mongoose";
import {} from "./types";

export interface ProductInterface extends mongoose.Document {
  ean: string;
  categories: string[];
  imageUrl: string | undefined;
  ingredientsText?: string;
  ingredientsTextDE?: string; //may not be necessary
  nutriScore: string;
  nutriScoreScore?: number; //used to calculate nutri-score
  quantity?: string;
  brands?: string;
  labels?: string;
  categories_tags?: string[];
  productName: string;
  productNameDE: string;
}

export const ProductSchema = new mongoose.Schema({
  // used to create collections, generated at the time request processing
  ean: {
    type: String,
    required: false,
  },
  receiptNames: {
    type: [String],
    required: true,
  },
  categories: {
    type: [String],
    required: false,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  ingredients: {
    type: [Map],
    required: false,
  },
  ingredientsText: {
    type: String,
    required: false,
  },
  ingredientsTextDE: {
    type: String,
    required: false,
  },
  nutriments: {
    type: Map,
    required: true,
  },
  ecoscoreGrade: {
    type: String,
    required: false,
  },
  novaGroup: {
    type: Number,
    required: false,
  },
  nutriScore: {
    type: String,
    required: false,
  },
  nutriscoreData: {
    type: Map,
    required: false,
  },
  nutriScoreScore: {
    type: Number,
    required: false,
  },
  quantity: {
    type: String,
    required: false,
  },
  nutrientLevels: {
    type: Map,
    required: false,
  },
  brands: {
    type: String,
    required: false,
  },
  labels: {
    type: String,
    required: false,
  },
  productName: {
    type: String,
    required: false,
  },
  categories_tags: {
    type: [String],
    required: false,
  },
  productNameDE: {
    type: String,
    required: false,
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
