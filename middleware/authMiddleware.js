
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import { User } from "../models/User.js";


export const protect = asyncHandler(
  async (req, res, next) => {

    const authHeader =
      req.headers.authorization;

    let token;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      token =
        authHeader.split(" ")[1];
    }

    if (!token) {
      res.status(401);
      throw new Error(
        "Not authorized, no token"
      );
    }

    try {

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      req.user =
        await User.findById(
          decoded.id
        ).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error(
          "User not found"
        );
      }

      next();

    } catch (error) {

      res.status(401);

      throw new Error(
        "Not authorized, token failed"
      );
    }
  }
);


export const authorizeRoles =
  (...roles) =>
    (req, res, next) => {

      if (
        !req.user ||
        !roles.includes(req.user.role)
      ) {
        res.status(403);

        throw new Error(
          "Admin access required"
        );
      }

      next();
    };
