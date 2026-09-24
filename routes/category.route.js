import express from "express";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategory,
  getCategorys,
  uploadImage,
} from "../controllers/category.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

import multer from "multer";

// store file temporarily
const upload = multer({ dest: "category/" });

const router = express.Router();

router.post("/create", verifyToken, createCategory);
router.delete("/delete/:id", verifyToken, deleteCategory);
router.post("/update/:id", verifyToken, updateCategory);
router.get("/get/:id", getCategory);
router.get("/get", getCategorys);
router.post("/upload", upload.single("image"), uploadImage);
export default router;
