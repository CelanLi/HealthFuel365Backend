import { Request, Response } from "express";

import bcrypt, { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { internalServerErrorMessage, JwtSecret } from "../config";

import Userschema from "../models/user";
import ProfileSchema from "../models/profile";
import AddressSchema from "../models/address";

import user from "../models/user";

export async function register(req: Request, res: Response) {
  console.log("789",req.body)
  const newUser = new Userschema(req.body);

  if (!newUser) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Invalid User object",
    });
  } else if (!newUser.password) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Invalid password",
    });
  }
  try {
    //search for user with given username
    const existingUser = await Userschema.findOne({
      username: newUser.username,
    });
    if (existingUser) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Username already exists",
      });
    }
    //password hashing
    const salt = bcrypt.genSaltSync(10); //rather than directly store the password in the database, salt value is used to encrypt the password
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    newUser.password = hashedPassword;
    //save new user into database
    let user = await newUser.save();
    console.log(user._id)
    ProfileSchema.create({
      userID: user._id,
      // name: undefined,
      // goal: undefined,
      typeOfEater: "Omnivore",
      // dietaryPreferences: undefined,
      losingWeightAsGoal: false,
      lowInFat: false,
      lowInSugar: false,
      lowInSalt: false,
      nutriPreference: ['A','B','C','D','E']
    });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JwtSecret,
      {
        expiresIn: 86400, // expires in 24 hours
      }
    );

    console.log(token)

    return res
      .status(200)
      .json({ token: token, message: "User was created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function login(req: Request, res: Response) {
  console.log("123",req.body)
  const { username, password } = req.body;
  //check for correct params
  if (!username || !password) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Missing param: " + (username ? "password" : "username"),
    });
  }
  try {
    //find user
    const user = await Userschema.findOne({ username });
    if (!user) {
      return res.status(404).json({
        error: "Not Found",
        message: "User not found",
      });
    }
    //check correct password
    const correctPassword = compareSync(password, user.password);
    if (!correctPassword) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Wrong password",
      });
    }
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

    return res.status(200).json({
      token: token,
      expiresIn: expirationTime,
    });
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function profileEdit(req: Request, res: Response) {
  
  const profile = req.body;
  console.log("edit",profile)

  try {
    //@ts-ignore
    const userID = req.userId; //current user's id
    // const userID = "64872a4ed2c673dd7bba2b39";
    console.log("afdlka",userID)
    const existingUser = await Userschema.findOne({
      _id: userID,
    });
    console.log("aaa",existingUser)

    if (!userID || !existingUser) {
      return res.status(400).json({
        error: "Bad Request",
        message: "User doesn't exist!",
      });
    }

    console.log("fasfll")
    const profileToBeEdit = await ProfileSchema.findOne({
      userID: userID,
    });
    console.log("dafjlaj",profileToBeEdit)

    if (!profileToBeEdit) {
      return res.status(404).json({
        error: "Not Found",
        message: `Profile with ID:${userID} not found!`,
      });
    }
    console.log("saf")
    const profileResponse = ProfileSchema.findOneAndUpdate({ _id: profileToBeEdit._id }, profile, { new: true });
    profileResponse
      .then((updatedProfile) => {
        // If updated, then save
        if(updatedProfile){
          updatedProfile.save()
          .then((savedProfile) => {
            console.log('Profile saved:', savedProfile);
          })
          .catch((error) => {
            console.error('Error saving profile:', error);
          });
        }
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
      });
    // profileResponse.save();
    console.log("dafa",profileResponse)
    return res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function addressAdd(req: Request, res: Response) {
  console.log("enter")
  const newAddress = new AddressSchema(req.body)
  console.log("addressAdd",newAddress)

  try {
    //@ts-ignore
    const userID = req.userId; //current user's id
    // const userID = "64872a4ed2c673dd7bba2b39";
    console.log("afdlka",userID)
    const existingUser = await Userschema.findOne({
      _id: userID,
    });
    console.log("aaa",existingUser)

    if (!userID || !existingUser) {
      return res.status(400).json({
        error: "Bad Request",
        message: "User doesn't exist!",
      });
    }

    console.log(userID)
    newAddress.userID = userID;
    console.log("kljkl",newAddress)
    let address = await newAddress.save();

    // profileResponse.save();
    console.log("dafa",address)
    return res.status(200).json({
      message: "Address added successfully",
    });
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function getUser(req: Request, res: Response) {
  const userID = req.query.id;
  Userschema.findById(userID)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          error: "Not Found",
          message: "User not found",
        });
      }
      //send out modified userobject, since we do not want to send out the password
      const requestedUser = {
        username: user.username,
        id: user._id,
      };
      return res.status(200).json(requestedUser);
    })
    .catch((error) => res.status(500).json(internalServerErrorMessage));
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params; //the requested id
  try {
    //@ts-ignore
    const userID = req.userId; //current user's id
    if (!id) {
      return res.status(400).json({
        error: "Bad Request",
        message: "No id defined",
      });
    }
    let userToBeDeleted = await Userschema.findById({ _id: id });
    if (!userToBeDeleted) {
      return res.status(404).json({
        error: "Not Found",
        message: `User with ID:${id} not found!`,
      });
    }
    if (id !== userID) {
      return res.status(403).json({
        error: "Forbidden",
        message: `You do not have the rights to delete the user with ID:${id}`,
      });
    }

    await Userschema.findByIdAndDelete(id);
    await ProfileSchema.findOneAndDelete({ userID: id });
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}
