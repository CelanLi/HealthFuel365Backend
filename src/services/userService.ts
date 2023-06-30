import bcrypt, { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { internalServerErrorMessage, JwtSecret } from "../config";

import AddressSchema, { AddressInterface } from "../models/address";
import  Userschema, { User } from "../models/user";
import ProfileSchema, { ProfileInterface } from "../models/profile";

// the result of login interface
interface LoginResult {
  token: string;
  expiresIn: number;
}

export const loginUser = async (
  username: string, password: string
): Promise<LoginResult | null> => {
  return new Promise(async (resolve, reject) => {
    console.log("loginuser")
    /* 1. if params missing */
    if (!username || !password) {
      reject("Missing param: " + (username ? "password" : "username"));
      return;
    };
    /* 2. try to find a user */
    try {
      // find user
      const user = await Userschema.findById({ username });
      // if user do not exist
      if (!user) {
        reject("User not found");
        return;
      }
      // check correct password
      const correctPassword = compareSync(password, user.password);
      if (!correctPassword) {
        reject("Wrong password");
        return;
      }

      // if all conditions are fullfilled, set a token for user
      const expirationTime = 86400; // expires in 24 hours
      // create a token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JwtSecret,
        {
          expiresIn: expirationTime, // expires in 24 hours
        }
      );
      console.log(token)

      // Resolve with the token and expiration time
      resolve({
        token: token,
        expiresIn: expirationTime,
      });
    } catch (error) {
      
    }
  })
};

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