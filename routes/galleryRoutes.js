
import express from "express";

import {
  getImages,
  uploadImage,
  deleteImage,
} from "../controllers/galleryController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

import {
  upload,
} from "../middleware/uploadMiddleware.js";

const router = express.Router();


// सभी images देख सकते हैं
router.get(
  "/",
  getImages
);


// केवल Admin image upload कर सकता है
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  uploadImage
);


// केवल Admin image delete कर सकता है
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteImage
);

export default router;
