import express from "express";
import * as ProductController from "../controllers/productController";
import { checkAuthentication } from "../middleware/middleware";

/**
 * router refers to http://localhost:8081/product/...route
 */
const productRoutes = express.Router();

productRoutes.post("/add", checkAuthentication, ProductController.addProduct); //for admin pannel
productRoutes.post(
  "/update/:id",
  checkAuthentication,
  ProductController.updateProduct
); //for admin pannel
productRoutes.delete(
  "/:id",
  checkAuthentication,
  ProductController.deleteProduct
); //for admin pannel

productRoutes.get("/:selectedSort", (req, res) => {
  const { search } = req.query;
  if (search) {
    ProductController.getProductsByName(req, res);
    console.log("by name: " + search);
  } else {
    ProductController.getAllProducts(req, res);
    console.log("all");
  }
});

export default productRoutes;
