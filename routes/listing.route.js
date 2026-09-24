import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
  uploadFiles,
  uploadImage,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

import multer from "multer";

// store file temporarily
const upload = multer({ dest: "products/" });

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateListing);
router.get("/get/:id", getListing);
router.get("/get", getListings);
// upload.single("image"),
// router.post("/upload", verifyToken, uploadFiles);
router.post("/upload", upload.single("image"), uploadImage);
export default router;
