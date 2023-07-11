import * as mongoose from "mongoose";

export interface User extends mongoose.Document {
  username: string;
  password: string;
  userID: string;
  email: string;
  avatar?: string;
}

export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
});

// This maps the internal id of the user created by mongoose to the field id
// when accessed via to JSON
UserSchema.virtual("id").get(function () {
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

UserSchema.set("toJSON", {
  virtuals: true,
});

//export user schema
export default mongoose.model<User>("User", UserSchema);
