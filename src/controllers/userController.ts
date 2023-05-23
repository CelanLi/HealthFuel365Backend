import { Request, Response } from "express";
import Userschema from "../models/user";
import bcrypt, { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { internalServerErrorMessage, JwtSecret } from "../config";
import ProfileSchema from "../models/profile";

export async function register(req: Request, res: Response) {}
