import express from "express";
import * as AdminController from "../controllers/adminController";

/**
 * router refers to http://localhost:8081/admin/...route
 */
const adminRoutes = express.Router();

adminRoutes.get("/user", AdminController.getAllUsersWithProfiles);
adminRoutes.delete("/:userID", AdminController.deleteUserWithProfile);
adminRoutes.put("/update/:userID/:email", AdminController.updateUserEmail);

adminRoutes.get("/getAllPromoCode", AdminController.getAllPromoCode);
adminRoutes.post("/deletePromoCode", AdminController.deletePromoCode);
adminRoutes.post("/updatePromoCode", AdminController.updatePromoCode);
adminRoutes.post("/addPromoCode" ,AdminController.addPromoCode);

adminRoutes.get("/orders/:keyWords",AdminController.getAllOrdersWithService);
adminRoutes.get("/getOrder/:orderID",AdminController.getOrderById);
adminRoutes.put("/orders/update/:orderID/:status/:trackingnumber",AdminController.updateOrder);

export default adminRoutes;