import express from "express";
import * as ProfileController from "../controllers/profileController";
import { checkAuthentication } from "../middleware/middleware";

/**
 * router refers to http://localhost:8081/profile/...route
 */
const profileRoutes = express.Router();

profileRoutes.get("/", checkAuthentication, ProfileController.getProfile);
profileRoutes.post(
  "/update",
  checkAuthentication,
  ProfileController.updateProfile
);

export default profileRoutes;
