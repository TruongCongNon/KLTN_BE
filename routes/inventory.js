import express from "express";
import inventoryController from "../controllers/inventoryController.js";

const router = express.Router();

// router.get("/:productId", inventoryController.getInventoryByProductId);
router.get("/history", inventoryController.getStockHistory);
router.put("/:productId/add", inventoryController.addStock);
router.put("/:productId/sell", inventoryController.sellProduct);
router.get("/get/export-inventory", inventoryController.exportInventory)
export default router;
 