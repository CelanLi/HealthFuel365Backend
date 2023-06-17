import * as mongoose from "mongoose";
import { ProfileSchema } from "./profile";

export interface AddressInterface extends mongoose.Document{
    userID: string;
    street: string;
    postCode: number;
    city: string;
    additionalAddress: string;
    tel: string;
    receiver: string;
}

export const AddressSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        unique: true,
    },
    street: {
        type: String,
        required: true,
    },
    postCode: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    additionalAddress: {
        type: String,
        required: true,
    },
    tel: {
        type: String,
        required: true,
    },
    receiver: {
        type: String,
        required: true,
    },
});

/* This maps the internal id of the address
 created by mongoose to the field id when accessed via to JSON */
AddressSchema.virtual("id").get(function(){
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    return this._id.toHexString();
})

AddressSchema.set("toJSON", {
    virtuals: true,
});

export default mongoose.model<AddressInterface>("Address", AddressSchema);