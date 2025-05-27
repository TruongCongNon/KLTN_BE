import express from "express";
import inventoryController from "../controllers/inventoryController.js";
import middlewareController from "../middleware/middlewareController.js";

const router = express.Router();

// router.get("/:productId", inventoryController.getInventoryByProductId);
router.get("/history",middlewareController.verifyTokenAndRole("admin","warehouse"), inventoryController.getStockHistory);
router.put("/:productId/add",middlewareController.verifyTokenAndRole("admin","warehouse"), inventoryController.addStock);
router.put("/:productId/sell",middlewareController.verifyTokenAndRole("admin","warehouse","user"), inventoryController.sellProduct);
router.get("/get/export-inventory",middlewareController.verifyTokenAndRole("admin","warehouse"), inventoryController.exportInventory)

export default router;
 