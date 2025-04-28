import { Router } from "express";
import user from "../controllers/userController.js";
import middlewareController from "../middleware/middlewareController.js";
import upload from "../middleware/middlewareImage.js";

const router = Router();
router.get("/",middlewareController.verifyTokenAndAdminAuth, user.getAllUsers);
router.get("/:id" ,middlewareController.verifyTokenAndAdminAuth, user.getUserById)
router.put("/update/:id",upload.single('images'), middlewareController.verifyTokenAndAdminAuth, user.updateUser);
router.delete("/:id", middlewareController.verifyTokenAndAdminAuth, user.deleteUser);
export default router;