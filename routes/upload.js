import { Router } from "express";
import upload from "../middleware/middlewareImage.js";
import imagecontroller from "../controllers/imageController.js";
const router =  Router()
router.post("/upload",upload.array("images",10), imagecontroller.uploadImages)

export default router;
