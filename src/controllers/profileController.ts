import { Request, Response } from "express";
import { badRequestErrorMessage, internalServerErrorMessage } from "../config";
import ProfileSchema, { ProfileInterface } from "../models/profile";
import { IProfile } from "../models/types";
import UserSchema from "../models/user";
export async function createProfile(req: Request, res: Response) {
  const { profile } = req.body;
  try {
    //@ts-ignore
    const userID = req.userId;

    if (!profile) {
      return res
        .status(400)
        .json(badRequestErrorMessage("Profile information missing from body"));
    }

    let newProfile: IProfile = {
      goal: profile.goal,
      typeOfEater: profile.typeOfEater,
      dietaryPreferences: profile.dietaryPreferences,
    };

    let p = await new ProfileSchema(newProfile).save();

    return res.status(200).send({
      message: "Saved Profile",
      profile: p,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function updateProfile(req: Request, res: Response) {
  const { profile } = req.body;
  try {
    //@ts-ignore
    const userID = req.userId;

    if (!profile) {
      return res
        .status(400)
        .json(badRequestErrorMessage("Profile information missing from body"));
    }

    let updatedProfile: IProfile = {
      goal: profile.goal,
      typeOfEater: profile.typeOfEater,
      dietaryPreferences: profile.dietaryPreferences,
    };

    let p = await ProfileSchema.findOneAndUpdate(
      {
        userID: userID,
      },
      updatedProfile,
      { returnOriginal: false }
    );

    if (!p) {
      //if not found
      let p = await new ProfileSchema(updatedProfile).save();
      return res.status(200).send({
        profile: p,
        message: "Created Profile",
      });
    }
    return res.status(200).send({
      //if found, then update
      profile: p,
      message: "Updated Profile",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    //@ts-ignore
    const userID = req.userId;
    let profile = undefined;
    //check if admin then return all profiles
    const user = await UserSchema.findById(userID);
    if (user?.username == "admin") {
      profile = await ProfileSchema.find();
    } else {
      //if not, then get certain profile
      profile = await ProfileSchema.find({
        userID: userID,
      });
    }

    return res.status(200).send({
      profile: profile[0],
      message: "Retrieved Profile",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(internalServerErrorMessage);
  }
}
