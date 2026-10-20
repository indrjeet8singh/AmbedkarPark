
import express from "express";
import {
  getUsers,
  updateUser,
} from "../controllers/userController.js";
import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only: view users
router.get("/", protect, getUsers);

// Admin only: edit user
router.put("/:id", protect, authorizeRoles("admin"), updateUser);

export default router;
