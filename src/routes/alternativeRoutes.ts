import express from "express";
import * as AlternativeController from "../controllers/alternativeController";

/**
 * router refers to http://localhost:8081/alternative/...route
 */
const alternativeRoutes = express.Router();

alternativeRoutes.get("/:junkFoodType", AlternativeController.getAlternative);

export default alternativeRoutes;