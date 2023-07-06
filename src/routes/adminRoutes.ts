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
adminRoutes.post("/addPromoCode", AdminController.addPromoCode);

adminRoutes.get("/orders", AdminController.getAllOrdersWithService);
adminRoutes.get("/getOrder/:orderID", AdminController.getOrderById);
adminRoutes.put(
  "/orders/update/:orderID/:status/:trackingnumber",
  AdminController.updateOrder
);

adminRoutes.get("/products", AdminController.getProductsWithDetails);
adminRoutes.get(
  "/products/edit/:productID",
  AdminController.getProductWithDetail
);
adminRoutes.delete(
  "/products/delete/:productID",
  AdminController.deleteProduct
);
adminRoutes.post("/products/add", AdminController.addProduct);
adminRoutes.post("/products/update/:productID", AdminController.updateProduct);

export default adminRoutes;