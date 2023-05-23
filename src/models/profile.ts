import * as mongoose from "mongoose";

export interface ProfileInterface extends mongoose.Document {
  goal: string;
  dietaryPreference: string;
  typeOfEater: string;
}

export const ProfileSchema = new mongoose.Schema({
  goal: {
    type: String,
    required: true,
  },
  dietaryPrederence: {
    type: String,
    required: true,
  },
  typeOfEater: {
    type: String,
    required: true,
  },
});
/* This maps the internal id of the profile
 created by mongoose to the field id when accessed via to JSON */
ProfileSchema.virtual("id").get(function () {
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

ProfileSchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.model<ProfileInterface>("Profile", ProfileSchema);
