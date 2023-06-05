import * as mongoose from "mongoose";
import { ProductInterface } from "./product";

export interface ProductItem extends mongoose.Document {
  shoppingCartID: string;
  product: ProductInterface;
  quantity: number;
}

export const ProductItemSchema = new mongoose.Schema({
  // used to create collections, generated at the time request processing
  shoppingCartId: {
    type: String,
    required: true,
  },
  product: {
    type: [
      {
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
        nutriScore: {
          type: String,
          required: false,
        },
        nutriScoreScore: {
          type: Number,
          required: false,
        },
        quantity: {
          type: Number,
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
        productPrice: {
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
      },
    ],
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
