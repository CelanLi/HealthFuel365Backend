import express from "express";
import * as ShoppingCartController from "../controllers/shoppingCartController";
import { checkAuthentication } from "../middleware/middleware";

/**
 * router refers to http://localhost:8081/user/...route
 */
const shoppingCartRoutes = express.Router();

//To do: checkAuthentication
shoppingCartRoutes.get(
  "/shoppingCartList",
  checkAuthentication,
  ShoppingCartController.getShoppingCartList
);
shoppingCartRoutes.post(
  "/deleteProductItem",
  checkAuthentication,
  ShoppingCartController.deleteProductItem
);
shoppingCartRoutes.post(
  "/changeProductCount",
  checkAuthentication,
  ShoppingCartController.changeProductCount
);
shoppingCartRoutes.post(
  "/validateCode",
  checkAuthentication,
  ShoppingCartController.validateCode
);
shoppingCartRoutes.post(
  "/deletePromoCode",
  checkAuthentication,
  ShoppingCartController.deletePromoCode
);

export default shoppingCartRoutes;
