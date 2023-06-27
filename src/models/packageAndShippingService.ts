import * as mongoose from "mongoose"; 

export interface PackageAndShippingServiceInterface extends mongoose.Document {
  orderID: string;
  isDHL: boolean;
  rapidShipping: boolean;
  sendAsAGift: boolean;
}

export const PackageAndShippingServiceSchema = new mongoose.Schema({
  orderID: {
    type: String,
    required: true,
  },
  isDHL: {
    type: Boolean,
    required: true,
  },

  rapidShipping: {
    type: Boolean,
    required: true,
  },
  sendAsAGift: {
    type: Boolean,
    required: true,
  },
});

/* This maps the internal id of the address
 created by mongoose to the field id when accessed via to JSON */
PackageAndShippingServiceSchema.virtual("id").get(function () {
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

PackageAndShippingServiceSchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.model<PackageAndShippingServiceInterface>(
  "PackageAndShippingService",
  PackageAndShippingServiceSchema
);
