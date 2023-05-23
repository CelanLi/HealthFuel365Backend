import express from "express";
import * as ProductController from "../controllers/productController";
import { checkAuthentication } from "../middleware/middleware";

/**
 * router refers to http://localhost:8081/product/...route
 */
const productRoutes = express.Router();

productRoutes.post("/add", checkAuthentication, ProductController.addProduct);
productRoutes.post(
  "/update/:id",
  checkAuthentication,
  ProductController.updateProduct
);
productRoutes.delete(
  "/:id",
  checkAuthentication,
  ProductController.deleteProduct
);
productRoutes.get("/", ProductController.getProductsByName);

export default productRoutes;
