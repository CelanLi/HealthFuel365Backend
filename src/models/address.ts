import * as mongoose from "mongoose";
import User from './user'

export interface AddressInterface extends mongoose.Document{
    user: mongoose.Schema.Types.ObjectId;
    street: string;
    postCode: number;
    city: string;
    additionalAddress: string;
    tel: string;
    receiver: string;
}

export const AddressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User, // 引用 User 模型
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