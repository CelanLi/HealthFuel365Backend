import { findRecommendations, findRecommendationsWithCookies } from "../services/recommendationService";
import { Request, Response } from "express";

import { internalServerErrorMessage } from "../config";

export async function getRecommendations(req: Request, res: Response) {
    try {
    // without user id
      let recommendations = await findRecommendations();
      if (!recommendations) {
        return res.status(404).json({
          error: "Not Found",
          message: `Recommendations not found!`,
        });
      }
    //   console.log(recommendations);
      return res.status(200).json(recommendations);
      }catch (error) {
      return res.status(500).json(internalServerErrorMessage);
    }
}

export async function getRecommendationsWithCookies(req: Request, res: Response) {
    try {
      //@ts-ignore
      const userID = req.userId;
      console.log("userID",userID);
      let recommendations = await findRecommendationsWithCookies(userID);
      if (!recommendations) {
        return res.status(404).json({
          error: "Not Found",
          message: `Recommendations not found!`,
        });
      }
    //   console.log(recommendations);
      return res.status(200).json(recommendations);
      }catch (error) {
      return res.status(500).json(internalServerErrorMessage);
    }
}