import { Router } from "express";
import cartController from "../controllers/cartController.js";
import middlewareController from "../controllers/middlewareController.js";

const router = Router();
// router.get("/", cartController.getCart);
router.post("/add", middlewareController.verifyToken, cartController.addToCart);
router.post("/remove", middlewareController.verifyToken, cartController.removeFromCart);

export default router;
