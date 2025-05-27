import { Router } from "express";
import middlewareController from "../middleware/middlewareController.js";
import orderController from "../controllers/orderController.js";
import upload from "../middleware/middlewareImage.js";
const router = Router();
router.post("/", middlewareController.verifyToken, orderController.createOrder);
router.get(
  "/",

  middlewareController.verifyTokenAndRole("admin", "shipper"),
  orderController.getOrder
);
router.get(
  "/:id",
  middlewareController.verifyToken,
  orderController.getOrdersByUserId
);
router.get(
  "/order/:id",
  middlewareController.verifyToken,
  orderController.getOrderbyId
);
router.put(
  "/:id",

  middlewareController.verifyTokenAndRole("admin", "shipper"),
  orderController.updateOrder
);
router.delete(
  "/:id",
  middlewareController.verifyToken,
  orderController.deleteOrder
);
router.put(
  "/cancel/:id",
  middlewareController.verifyToken,
  orderController.cancelOrder
);
router.put("/update-address/:id",upload.array("images",5), orderController.updateAddress);
export default router;
