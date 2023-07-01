import { Request, Response } from "express";
import { badRequestErrorMessage, internalServerErrorMessage } from "../config";
import {
  findAllUsersWithProfiles,
  deleteUser,
  updateEmail,
  findAllPromoCodes,
  removePromoCode,
  editPromoCode,
  createPromoCode,
} from "../services/adminService";
import PromoCodeSchema from "../models/promocode";

export async function getAllUsersWithProfiles(req: Request, res: Response) {
  try {
    const user_profile = await findAllUsersWithProfiles();
    return res.status(200).send(user_profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function deleteUserWithProfile(req: Request, res: Response) {
  const userID = req.params.userID;
  try {
    await deleteUser(userID);
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function updateUserEmail(req: Request, res: Response) {
  const userID = req.params.userID;
  const email = req.params.email;
  try {
    await updateEmail(userID, email);
    return res.status(200).json({
      message: "Email update successfully",
    });
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function getAllPromoCode(req: Request, res: Response) {
  const { keyWords = "" } = req.query || {}; 
  try {
    const promocode = await findAllPromoCodes(keyWords);
    return res.status(200).send(promocode);
  } catch (error) {
    console.error(error);
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function deletePromoCode(req: Request, res: Response) {
  const { promoCodeID } = req.body;
  try {
    await removePromoCode(promoCodeID);
    return res.status(200).json({
      message: "Promo Code deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function updatePromoCode(req: Request, res: Response) {
  const { promocodeID, code, expirationDate, discountRate, minThreshold } =
    req.body;
  try {
    try {
      await editPromoCode(
        promocodeID,
        code,
        expirationDate,
        discountRate,
        minThreshold
      );

      return res.status(200).send({ code: 0, message: "sucess" });
    } catch (err) {
      console.log(err);
      return res.status(200).send({ code: -1, message: err });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(internalServerErrorMessage);
  }
}

export async function addPromoCode(req: Request, res: Response) {
  const { code, expirationDate, discountRate, minThreshold } = req.body;

  try {
    try {
      await createPromoCode(code, expirationDate, discountRate, minThreshold);
      return res.status(200).send({ code: 0, message: "sucess" });
    } catch (err) {
      return res.status(200).send({ code: -1, message: err });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(internalServerErrorMessage);
  }
}
