import express from "express";
import { LoginUser, LogoutUser, RegisterUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", RegisterUser).post("/login", LoginUser).get("/logout", LogoutUser);

export default router;
