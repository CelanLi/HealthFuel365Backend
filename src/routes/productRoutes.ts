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

productRoutes.get("/:selectedSort", (req, res) => {
  const { search } = req.query;
  if (search) {
    ProductController.getProductsByName(req, res);
  } else {
    ProductController.getAllProducts(req, res);
  }
});
productRoutes.post(
  "/addToSc/:shoppingCartID/:productID",
  checkAuthentication,
  ProductController.addShoppingCart
);
productRoutes.get("/filter/brands", ProductController.getAllBrands);

export default productRoutes;
