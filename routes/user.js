import { Router } from "express";
import user from "../controllers/userController.js";
import middlewareController from "../controllers/middlewareController.js";

const router = Router();
router.get("/", middlewareController.verifyToken, user.getAllUsers);
// router.put("/update/:id", middlewareController.verifyToken, user.updateUser);
router.delete("/:id", middlewareController.verifyTokenAndAdminAuth, user.deleteUser);
export default router;