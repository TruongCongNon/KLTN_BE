import express from "express";
import flashSaleController from "../controllers/flashSaleController.js";

const router = express.Router();

router.post("/", flashSaleController.createFlashSale);
router.get("/", flashSaleController.getActivedFlashSale);
router.get("/discount/:productId", flashSaleController.getDiscountFlashSale);
router.put("/:id", flashSaleController.updateFlashSale);
router.get("/product/:id", flashSaleController.getFlashSaleById);
router.delete(
  "/remove-by-product/:productId",
  flashSaleController.removeFlashSaleByProductId
);

export default router;
