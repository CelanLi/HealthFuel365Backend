import express from "express";
import * as openfoodfactsController from "../controllers/openfoodfactsController";
import { checkAuthentication } from "../middleware/middleware";

const orderRoutes = express.Router();

orderRoutes.get("/:id", openfoodfactsController.findProduct);

export default orderRoutes;
