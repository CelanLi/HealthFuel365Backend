import express from "express";
import * as recommendationController from '../controllers/recommendationController'
import { checkAuthentication } from "../middleware/middleware";

const recommendationRoutes = express.Router();

recommendationRoutes.get("/getRecommendations",recommendationController.getRecommendations);
recommendationRoutes.get("/getRecommendationsWithCookies",checkAuthentication,recommendationController.getRecommendationsWithCookies);

export default recommendationRoutes;