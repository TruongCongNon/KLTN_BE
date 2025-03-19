import express from "express";
import inventoryController from "../controllers/inventoryContriller.js";

const router = express.Router();

// Lấy tồn kho của một sản phẩm
router.get("/:productId", inventoryController.getInventoryByProductId);

// Cập nhật số lượng tồn kho
router.put("/:productId", inventoryController.updateInventory);

export default router;
