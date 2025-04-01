import { Router } from "express";
import productController from '../controllers/productController.js';
import middlewareController from "../middleware/middlewareController.js";
import upload from "../middleware/middlewareImage.js";


const router = Router();
router.post("/",upload.single("images"), middlewareController.verifyTokenAndAdminAuth, productController.createProduct);
router.get("/", productController.getAllProduct);
router.get("/:id",middlewareController.verifyToken, productController.getOneByIdProduct);
router.delete("/:id",middlewareController.verifyTokenAndAdminAuth, productController.deleteProduct);
router.put("/update/:id",upload.single('images'),middlewareController.verifyTokenAndAdminAuth, productController.updateProduct);
router.get("/related/:id",middlewareController.verifyTokenAndAdminAuth, productController.getRelatedProduct);
router.get("/all/category", productController.getAllProductCategory);
export default router;
