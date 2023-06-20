import { Request, Response } from "express";
import { badRequestErrorMessage, internalServerErrorMessage } from "../config";
import { findAlternative } from "../services/alternativeService";

export async function getAlternative(req: Request, res: Response) {
  const { junkFoodType } = req.params;
  try {
    const alternative = await findAlternative(junkFoodType);
    return res.status(200).send(alternative);
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}