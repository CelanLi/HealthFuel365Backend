import { Request, Response } from "express";
import { badRequestErrorMessage, internalServerErrorMessage } from "../config";
import ProfileSchema, { ProfileInterface } from "../models/profile";
import { IProfile } from "../models/types";
import UserSchema from "../models/user";
