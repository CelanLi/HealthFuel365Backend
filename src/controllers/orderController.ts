import { Request, Response } from "express";
import Userschema from "../models/user";
import bcrypt, { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import {
  badRequestErrorMessage,
  internalServerErrorMessage,
  JwtSecret,
} from "../config";
import ProfileSchema from "../models/profile";
import { addOrder } from "../services/orderService";

export async function createOrder(req: Request, res: Response) {
  const { shoppingCartID, orDelivery, orService, orAddressID } = req.body;
  console.log("fddqqqqqqqqqqqqqq");
  try {
    //error
    if (!shoppingCartID || typeof shoppingCartID != "string") {
      return res
        .status(400)
        .json(badRequestErrorMessage("Missing body parameter shoppingCartID"));
    } else if (!orDelivery || typeof orDelivery != "string") {
      return res
        .status(400)
        .json(badRequestErrorMessage("Missing body parameter orDelivery"));
    } else if (typeof orService != "boolean") {
      return res
        .status(400)
        .json(badRequestErrorMessage("Missing body parameter orService"));
    } else if (typeof orAddressID != "string") {
      return res
        .status(400)
        .json(badRequestErrorMessage("Missing body parameter orAddressID"));
    }
 
    try {
      await addOrder(shoppingCartID, orDelivery, orService, orAddressID); 
      return res.status(200).send({ code: 0, message: "sucess" });
    } catch (err) {
      return res.status(200).send({ code: -1, message: err });
    }
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function register(req: Request, res: Response) {
  const newUser = new Userschema(req.body.user);
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
    ProfileSchema.create({
      userID: user._id,
      name: undefined,
      goal: undefined,
      typeOfEater: undefined,
      dietaryPreferences: undefined,
    });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JwtSecret,
      {
        expiresIn: 86400, // expires in 24 hours
      }
    );

    return res
      .status(200)
      .json({ token: token, message: "User was created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function login(req: Request, res: Response) {
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

    res.status(200).json({
      token: token,
      expiresIn: expirationTime,
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
