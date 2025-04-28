import { Router } from "express";
import middlewareController from "../middleware/middlewareController.js";
import categoriesController from "../controllers/categoriesController.js";
import upload from "../middleware/middlewareImage.js";

const router = Router();
router.post("/",upload.single("images"), categoriesController.createcategory);
router.get("/", categoriesController.getAllcategory);
router.get("/:id", categoriesController.getcategoryById);
router.put("/update/:id", upload.single('images'),categoriesController.updatecategory)
router.delete("/:id", categoriesController.deletecategory);
export default router;