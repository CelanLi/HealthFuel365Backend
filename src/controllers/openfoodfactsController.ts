import { Request, Response } from "express";
import { badRequestErrorMessage, internalServerErrorMessage } from "../config";

export async function findProduct(req: Request, res: Response) {
  const { code } = req.params;
  try {
    if (!code) {
      return res
        .status(400)
        .json(badRequestErrorMessage("Code is missing from request body"));
    }
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}
