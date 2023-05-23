import express from "express";
import * as openfoodfactsController from "../controllers/openfoodfactsController";
import { checkAuthentication } from "../middleware/middleware";

const openfoodfactsRoutes = express.Router();

openfoodfactsRoutes.get("/:code", openfoodfactsController.findProduct);

export default openfoodfactsRoutes;
