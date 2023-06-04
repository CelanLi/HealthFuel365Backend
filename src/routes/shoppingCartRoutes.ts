import express from "express";
import * as ShoppingCartController from "../controllers/shoppingCartController";
import { checkAuthentication } from "../middleware/middleware";

/**
 * router refers to http://localhost:8081/user/...route
 */
const shoppingCartRoutes = express.Router();

shoppingCartRoutes.get("/shoppingCartList", checkAuthentication, ShoppingCartController.getShoppingCartList);
// shoppingCartRoutes.post("/register", ShoppingCartController.register);
// shoppingCartRoutes.post("/", ShoppingCartController.login);
// shoppingCartRoutes.delete("/:id", checkAuthentication, ShoppingCartController.deleteUser);

export default shoppingCartRoutes;
