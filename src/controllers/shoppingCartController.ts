import { Request, Response } from "express";
import ShoppingCartSchema from "../models/shoppingcart";
import bcrypt, { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { internalServerErrorMessage, JwtSecret } from "../config";
import ProfileSchema from "../models/profile";

export async function getShoppingCartList(req: Request, res: Response) {}
