import { Router } from "express";
import auth from "../controllers/authController.js";
import middlewareController from "../controllers/middlewareController.js";

const router = Router();
router.post("/register", auth.registerUser);
router.post("/login", auth.loginUser);
router.post("/refresh ", auth.requestRefreshToken)
router.post("/logout", middlewareController.verifyToken, auth.logoutUser)
export default router;