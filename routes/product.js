import { Router } from "express";
import productController from '../controllers/productController.js';
import middlewareController from "../middleware/middlewareController.js";
import upload from "../middleware/middlewareImage.js";


const router = Router();
router.post("/",upload.array("images",10), productController.createProduct);
router.get("/",middlewareController.verifyTokenAndRole("admin","warehouse"), productController.getAllProduct);
router.get("/:id", productController.getOneByIdProduct);
router.delete("/:id", middlewareController.verifyTokenAndRole("admin","warehouse"), productController.deleteProduct);
router.put("/update/:id",upload.array("images",10), middlewareController.verifyTokenAndRole("admin","warehouse"), productController.updateProduct);
router.get("/related/:id", productController.getRelatedProduct);
router.get("/all/category", productController.getAllProductCategory);
router.get("/all/series", productController.getAllProductBySeries);
router.get("/category/:name", productController.getProductBycategoryName);
export default router;
