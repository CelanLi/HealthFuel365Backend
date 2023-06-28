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
import { addOrder, findOrderByUser } from "../services/orderService";

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

export async function getOrder(req: Request, res: Response) {
  console.log("getOrder")
  try {
    console.log("getOrder")
    //@ts-ignore
    const userID = req.userId; //current user's id
    const existingUser = await Userschema.findOne({
      _id: userID,
    });

    if (!userID || !existingUser) {
      return res.status(400).json({
        error: "Bad Request",
        message: "User doesn't exist!",
      });
    }

    const order = await findOrderByUser(userID);
    console.log("fjalkjflka",order)
    return res.status(200).send(order);
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}