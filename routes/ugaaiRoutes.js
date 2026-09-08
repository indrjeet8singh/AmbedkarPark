
import express from "express";

import {
  getUgaaiList,
  createUgaai,
  bulkCreateUgaai,
  updateUgaai,
  deleteUgaai,
} from "../controllers/ugaaiController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// सभी लोग देख सकते हैं
router.get(
  "/",
  getUgaaiList
);


// केवल Admin Add कर सकता है
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createUgaai
);


// केवल Admin CSV data upload कर सकता है
router.post(
  "/bulk",
  protect,
  authorizeRoles("admin"),
  bulkCreateUgaai
);


// केवल Admin Edit कर सकता है
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateUgaai
);


// केवल Admin Delete कर सकता है
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteUgaai
);

export default router;
