import express from "express";
import * as ProductDetailController from "../controllers/productDetailController";
import { checkAuthentication } from "../middleware/middleware";

/**
 * router refers to http://localhost:8081/product/...route
 */
const productDetailRoutes = express.Router();

productDetailRoutes.get("/:id", ProductDetailController.getDetailByID);

export default productDetailRoutes;
