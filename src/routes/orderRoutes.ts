import express from "express";
import * as openfoodfactsController from "../controllers/openfoodfactsController";
import * as orderController from "../controllers/orderController"
import { checkAuthentication } from "../middleware/middleware";

const orderRoutes = express.Router();

orderRoutes.get("/:id", openfoodfactsController.findProduct);

orderRoutes.post("/createOrder", orderController.createOrder);


export default orderRoutes;

 

