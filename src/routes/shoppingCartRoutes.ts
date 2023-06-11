import express from "express";
import * as ShoppingCartController from "../controllers/shoppingCartController";
import { checkAuthentication } from "../middleware/middleware";

/**
 * router refers to http://localhost:8081/user/...route
 */
const userRoutes = express.Router();
 

userRoutes.get("/shoppingCartList", ShoppingCartController.getShoppingCartList);
userRoutes.post("/deleteProductItem", checkAuthentication, ShoppingCartController.deleteProductItem);
userRoutes.post("/changeProductCount", checkAuthentication, ShoppingCartController.changeProductCount);
// userRoutes.post("/", ShoppingCartController.login);
// userRoutes.delete("/:id", checkAuthentication, ShoppingCartController.deleteUser);

export default userRoutes;
