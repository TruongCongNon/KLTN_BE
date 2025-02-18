import { Router } from "express";
import productController from '../controllers/productController.js';
import middlewareController from "../controllers/middlewareController.js";


const router = Router();
router.post("/", productController.createProduct);
router.get("/", productController.getAllProduct);
router.get("/:id",middlewareController.verifyTokenAndAdminAuth, productController.getOneByIdProduct);
router.delete("/:id",middlewareController.verifyTokenAndAdminAuth, productController.deleteProduct);
router.put("/update/:id", productController.updateProduct);
router.get("/related/:id", productController.getRelatedProduct);
export default router;
