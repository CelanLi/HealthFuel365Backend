import * as mongoose from "mongoose";

export interface PaymentInterface extends mongoose.Document {
  orderID: string; 
  paymentID:string;
  paid:Date;
}

export const PaymentSchema = new mongoose.Schema({
  orderID: {
    type: String,
    required: true,
  },
  paymentID: {
    type: String,
    required: true,
  },

  paid: {
    type: String,
    required: true,
  }, 
});

/* This maps the internal id of the address
 created by mongoose to the field id when accessed via to JSON */
 PaymentSchema.virtual("id").get(function () {
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

PaymentSchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.model<PaymentInterface>(
  "Payment",
  PaymentSchema
);
