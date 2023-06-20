import * as mongoose from "mongoose";

export interface ShoppingCart extends mongoose.Document {
  shoppingCartID: string;
  itemPrice: string;
  totalSaving: number;
  subTotal: number;
  itemQuantity: number;
  codeValue: string;
}

export const ShoppingCartSchema = new mongoose.Schema({
  shoppingCartID: {
    type: String,
    required: true,
    unique: true,
  },
  itemPrice: {
    type: Number,
    default:0,
    required: true,
  },
  totalSaving: {
    type: Number,
    default:0,
    required: true,
  },
  subTotal: {
    type: Number,
    default:0,
    required: true,
  },
  itemQuantity: {
    type: Number,
    default:0,
    required: true,
  },
  codeValue: {
    type: String,
    default:"",
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
export default mongoose.model<ShoppingCart>("ShoppingCart", ShoppingCartSchema);

 
