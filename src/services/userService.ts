import AddressSchema, { AddressInterface } from "../models/address";

export const findAddressByUser = async (
    userID: string
  ): Promise<AddressInterface[] | null> => {
    const addresses = await AddressSchema.find({
      user: userID,
    });
    return addresses;
  };