import { Router } from "express";
import middlewareController from "../middleware/middlewareController.js";
import orderController from "../controllers/orderController.js";

const router = Router();
router.post("/",middlewareController.verifyToken, orderController.createOrder);
router.get("/",middlewareController.verifyToken, orderController.getOrder);
router.get("/:id",middlewareController.verifyToken, orderController.getOrdersByUserId);
router.get("/order/:id",middlewareController.verifyToken, orderController.getOrderbyId)
router.put("/:id",middlewareController.verifyToken, orderController.updateOrder)
router.delete("/:id",middlewareController.verifyToken, orderController.deleteOrder)
router.put("/cancel/:id",middlewareController.verifyToken, orderController.cancelOrrder)
export default router;