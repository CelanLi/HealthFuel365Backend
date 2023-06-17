import express from "express";
import * as ShoppingCartController from "../controllers/shoppingCartController";
import { checkAuthentication } from "../middleware/middleware";

/**
 * router refers to http://localhost:8081/user/...route
 */
const shoppingCartRoutes = express.Router();
 
//To do: checkAuthentication
shoppingCartRoutes.get("/shoppingCartList", ShoppingCartController.getShoppingCartList);
shoppingCartRoutes.post("/deleteProductItem", ShoppingCartController.deleteProductItem);
shoppingCartRoutes.post("/changeProductCount", ShoppingCartController.changeProductCount);
shoppingCartRoutes.post("/validateCode",ShoppingCartController.validateCode);
shoppingCartRoutes.post("/deletePromoCode",ShoppingCartController.deletePromoCode);
 
export default shoppingCartRoutes;
