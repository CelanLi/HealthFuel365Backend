import * as mongoose from "mongoose";

export interface ShoppingCart extends mongoose.Document {
  shoppingCartID: string;
  itemPrice: string;
  totalSaving: number;
  subTotal: number;
  itemQuantity: number;
}

export const ShoppingCartSchema = new mongoose.Schema({
  shoppingCartID: {
    type: String,
    required: true,
    unique: true,
  },
  itemPrice: {
    type: Number,
    required: true,
  },
  totalSaving: {
    type: Number,
    required: true,
  },
  subTotal: {
    type: Number,
    required: true,
  },
  itemQuantity: {
    type: Number,
    required: true,
  },
});

// This maps the internal id of the user created by mongoose to the field id
// when accessed via to JSON
ShoppingCartSchema.virtual("id").get(function () {
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

ShoppingCartSchema.set("toJSON", {
  virtuals: true,
});

//export user schema
export default mongoose.model<ShoppingCart>("PromoCode", ShoppingCartSchema);
