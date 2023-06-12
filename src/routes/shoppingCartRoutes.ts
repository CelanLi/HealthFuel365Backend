import express from "express";
import * as ShoppingCartController from "../controllers/shoppingCartController";
import { checkAuthentication } from "../middleware/middleware";

/**
 * router refers to http://localhost:8081/user/...route
 */
const shoppingCartRoutes = express.Router();
 

shoppingCartRoutes.get("/shoppingCartList", ShoppingCartController.getShoppingCartList);
shoppingCartRoutes.post("/deleteProductItem", checkAuthentication, ShoppingCartController.deleteProductItem);
shoppingCartRoutes.post("/changeProductCount", checkAuthentication, ShoppingCartController.changeProductCount);
// userRoutes.post("/", ShoppingCartController.login);
// userRoutes.delete("/:id", checkAuthentication, ShoppingCartController.deleteUser);

export default shoppingCartRoutes;
