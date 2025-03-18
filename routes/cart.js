import { Router } from "express";
import cartController from "../controllers/cartController.js";
import middlewareController from "../middleware/middlewareController.js";

const router = Router();
router.get("/:userId",middlewareController.verifyToken, cartController.getCart);
router.post("/add", middlewareController.verifyToken, cartController.addToCart);
router.post("/remove", middlewareController.verifyToken, cartController.removeFromCart);
router.post("/clear", middlewareController.verifyToken, cartController.clearCart);


export default router;
