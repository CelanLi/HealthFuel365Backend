import bcrypt, { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { internalServerErrorMessage, JwtSecret } from "../config";

import AddressSchema, { AddressInterface } from "../models/address";
import  Userschema, { User } from "../models/user";
import ProfileSchema, { ProfileInterface } from "../models/profile";

export const getProfile = async (
    userID: string
): Promise<ProfileInterface | null> => {
  const profile = await ProfileSchema.findOne({
    userID: userID,
  });
  return profile;
};

export const findAddressByUser = async (
    userID: string
  ): Promise<AddressInterface[] | null> => {
    const addresses = await AddressSchema.find({
      user: userID,
    });
    return addresses;
  };