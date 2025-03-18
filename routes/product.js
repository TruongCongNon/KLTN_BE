import { Router } from "express";
import productController from '../controllers/productController.js';
import middlewareController from "../middleware/middlewareController.js";


const router = Router();
router.post("/", middlewareController.verifyTokenAndAdminAuth, productController.createProduct);
router.get("/", middlewareController.verifyTokenAndAdminAuth, productController.getAllProduct);
router.get("/:id",middlewareController.verifyToken, productController.getOneByIdProduct);
router.delete("/:id",middlewareController.verifyTokenAndAdminAuth, productController.deleteProduct);
router.put("/update/:id",middlewareController.verifyTokenAndAdminAuth, productController.updateProduct);
router.get("/related/:id",middlewareController.verifyTokenAndAdminAuth, productController.getRelatedProduct);
export default router;
