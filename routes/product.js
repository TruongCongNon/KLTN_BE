import { Router } from "express";
import productController from '../controllers/productController.js';
import middlewareController from "../middleware/middlewareController.js";
import upload from "../middleware/middlewareImage.js";


const router = Router();
router.post("/",upload.any(), productController.createProduct);
router.get("/", productController.getAllProduct);
router.get("/:id", productController.getOneByIdProduct);
router.delete("/:id", productController.deleteProduct);
router.put("/update/:id",upload.any(), productController.updateProduct);
router.get("/related/:id", productController.getRelatedProduct);
router.get("/all/category", productController.getAllProductCategory);
router.get("/all/series", productController.getAllProductBySeries);
router.get("/category/:name", productController.getProductBycategoryName);
export default router;
