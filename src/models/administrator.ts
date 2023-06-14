import * as mongoose from "mongoose";

export interface AdministratorInterface extends mongoose.Document {
  adminID: string;
  password: string;
}

export const AdministratorSchema = new mongoose.Schema({
  adminID: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
});

// This maps the internal id of the administrator created by mongoose to the field id
// when accessed via to JSON
AdministratorSchema.virtual("id").get(function () {
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

AdministratorSchema.set("toJSON", {
  virtuals: true,
});

//export user schema
export default mongoose.model<AdministratorInterface>("Administrator", AdministratorSchema);