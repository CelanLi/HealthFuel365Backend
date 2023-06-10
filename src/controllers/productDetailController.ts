import { Request, Response } from "express";
import { badRequestErrorMessage, internalServerErrorMessage } from "../config";
import { findDetailByID } from "../services/productDetailService";
export async function getDetailByID(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const productDetail = await findDetailByID(id);
    return res.status(200).send(productDetail);
  } catch (error) {
    return res.status(500).json(internalServerErrorMessage);
  }
}
