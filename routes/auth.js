import { Router } from "express";
import auth from "../controllers/authController.js";
import middlewareController from "../middleware/middlewareController.js";

const router = Router();
router.post("/register", auth.registerUser);
router.post("/login", auth.loginUser);
router.post("/refresh", auth.requestRefreshToken)
router.post("/logout", middlewareController.verifyToken, auth.logoutUser)
router.post("/forgot-password", auth.senOTP);
router.post("/verify-otp", auth.verifyOTP);
router.post("/reset-password",auth.resetPassword)   
export default router;