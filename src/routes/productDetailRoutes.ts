import express from "express";
import * as ProductDetailController from "../controllers/productDetailController";
import { checkAuthentication } from "../middleware/middleware";

/**
 * router refers to http://localhost:8081/product/...route
 */
const productDetailRoutes = express.Router();

// productRoutes.post(
//   "/add",
//   checkAuthentication,
//   ProductDetailController.addProduct
// ); //for admin pannel
// productRoutes.post(
//   "/update/:id",
//   checkAuthentication,
//   ProductDetailController.updateProduct
// ); //for admin pannel
// productRoutes.delete(
//   "/:id",
//   checkAuthentication,
//   ProductDetailController.deleteProduct
// ); //for admin pannel
productDetailRoutes.get("/:id", ProductDetailController.getDetailByID);

export default productDetailRoutes;
