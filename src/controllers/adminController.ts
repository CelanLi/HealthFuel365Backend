import { Request, Response } from "express";
import { badRequestErrorMessage, internalServerErrorMessage } from "../config";
import { findAllUsersWithProfiles, deleteUser, updateEmail } from "../services/adminService";

export async function getAllUsersWithProfiles(req: Request, res: Response) {
    try {
        const user_profile = await findAllUsersWithProfiles();
        return res.status(200).send(user_profile);
    } catch (error) {
      console.error(error);
      return res.status(500).json(internalServerErrorMessage);
    }
}

export async function deleteUserWithProfile(req: Request, res: Response) {
    const userID = req.params.userID;
    try {
        await deleteUser(userID);
        return res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      return res.status(500).json(internalServerErrorMessage);
    }
}

export async function updateUserEmail(req: Request, res: Response) {
    const userID = req.params.userID;
    const email = req.params.email;
    try {
        await updateEmail(userID,email);
        return res.status(200).json({
        message: "Email update successfully",
      });
    } catch (error) {
      return res.status(500).json(internalServerErrorMessage);
    }
}