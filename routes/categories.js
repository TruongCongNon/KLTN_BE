import { Router } from "express";
import middlewareController from "../middleware/middlewareController.js";
import categoriesController from "../controllers/categoriesController.js";

const router = Router();
router.post("/", categoriesController.createcategory);
router.get("/", categoriesController.getAllcategory);
router.put("/update/:id",middlewareController.verifyTokenAndAdminAuth,categoriesController.updatecategory)
router.delete("/:id", middlewareController.verifyTokenAndAdminAuth, categoriesController.deletecategory);
export default router;