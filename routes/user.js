import { Router } from "express";
import userController from "../controllers/userController.js";
import upload from "../middleware/middlewareImage.js";

const router = Router();
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/",upload.single("images"), userController.createUser);
router.put("/update/:id",upload.single("images") ,userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.put("/block/:id", userController.blockUser);
router.put("/unblock/:id", userController.unblockUser);

export default router;
