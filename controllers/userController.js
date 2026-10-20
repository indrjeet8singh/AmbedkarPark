
import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";

// GET ALL USERS
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select("-password -otp -otpExpire")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// UPDATE USER - ADMIN ONLY
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, role, isEmailVerified } = req.body;

  if (
    name === undefined &&
    email === undefined &&
    role === undefined &&
    isEmailVerified === undefined
  ) {
    res.status(400);
    throw new Error("At least one field is required");
  }

  const user = await User.findById(id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      res.status(400);
      throw new Error("Name is required");
    }
    user.name = name.trim();
  }

  if (email !== undefined) {
    if (typeof email !== "string" || !email.trim()) {
      res.status(400);
      throw new Error("Valid email is required");
    }

    const cleanEmail = email.trim().toLowerCase();

    const emailExists = await User.findOne({
      email: cleanEmail,
      _id: { $ne: user._id },
    });

    if (emailExists) {
      res.status(409);
      throw new Error("Email is already registered");
    }

    if (cleanEmail !== user.email) {
      user.email = cleanEmail;
      user.isEmailVerified = false;
      user.otp = null;
      user.otpExpire = null;
    }
  }

  if (role !== undefined) {
    if (!["user", "admin"].includes(role)) {
      res.status(400);
      throw new Error("Invalid role");
    }

    // Prevent admin from accidentally removing their own admin access.
    if (
      String(user._id) === String(req.user._id) &&
      role !== "admin"
    ) {
      res.status(400);
      throw new Error("You cannot remove your own admin role");
    }

    user.role = role;
  }

  if (isEmailVerified !== undefined) {
    if (typeof isEmailVerified !== "boolean") {
      res.status(400);
      throw new Error("isEmailVerified must be true or false");
    }

    // Changing email resets verification; don't allow bypassing it.
    if (
      email !== undefined &&
      email.trim().toLowerCase() !==
        (await User.findById(id)).email
    ) {
      user.isEmailVerified = false;
    } else {
      user.isEmailVerified = isEmailVerified;
    }
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
    },
  });
});
