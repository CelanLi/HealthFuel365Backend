import express from "express";
import * as AdminController from "../controllers/adminController";
import { checkAdminAuthentication } from "../middleware/middleware";

/**
 * router refers to http://localhost:8081/admin/...route
 */
const adminRoutes = express.Router();

adminRoutes.post("/login", AdminController.login);

adminRoutes.get(
  "/user",
  checkAdminAuthentication,
  AdminController.getAllUsersWithProfiles
);
adminRoutes.delete(
  "/:userID",
  checkAdminAuthentication,
  AdminController.deleteUserWithProfile
);
adminRoutes.put(
  "/update/:userID/:email",
  checkAdminAuthentication,
  AdminController.updateUserEmail
);

adminRoutes.get(
  "/getAllPromoCode",
  checkAdminAuthentication,
  AdminController.getAllPromoCode
);
adminRoutes.post(
  "/deletePromoCode",
  checkAdminAuthentication,
  AdminController.deletePromoCode
);
adminRoutes.post(
  "/updatePromoCode",
  checkAdminAuthentication,
  AdminController.updatePromoCode
);
adminRoutes.post(
  "/addPromoCode",
  checkAdminAuthentication,
  AdminController.addPromoCode
);

adminRoutes.get(
  "/orders",
  checkAdminAuthentication,
  AdminController.getAllOrdersWithService
);
adminRoutes.get(
  "/getOrder/:orderID",
  checkAdminAuthentication,
  AdminController.getOrderById
);
adminRoutes.put(
  "/orders/update/:orderID/:status/:trackingnumber",
  checkAdminAuthentication,
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
