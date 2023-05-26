import * as mongoose from "mongoose";

export interface Promocode extends mongoose.Document {
  code: string;
  expirationDate: Date;
  discountRate: number;
  minThreshold: number;
  usedUser: string[];
}

export const PromoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  discountRate: {
    type: String,
    required: true,
  },
  minThreshold: {
    type: Number,
    required: true,
  },
  usedUser: {
    type: [String],
    required: true,
  },
});

// This maps the internal id of the user created by mongoose to the field id
// when accessed via to JSON
PromoCodeSchema.virtual("id").get(function () {
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

PromoCodeSchema.set("toJSON", {
  virtuals: true,
});

//export user schema
export default mongoose.model<Promocode>("PromoCode", PromoCodeSchema);
