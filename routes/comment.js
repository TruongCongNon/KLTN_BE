import { Router } from "express";
import commentController from "../controllers/commentController.js";
import upload from "../middleware/middlewareImage.js";

const router = Router();

router.post("/",upload.array("images",5), commentController.createComment);
router.get("/product/:productId", commentController.getCommentsTreeByProduct);
router.get("/user/:userId", commentController.getCommentsByUser);
router.put("/:commentId", commentController.updateComment);
router.delete("/:commentId", commentController.deleteComment);
export default router;