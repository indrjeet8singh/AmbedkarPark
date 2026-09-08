
import asyncHandler from "express-async-handler";
import axios from "axios";

import {
  Gallery,
} from "../models/Gallery.js";


// GET ALL IMAGES
// PUBLIC

export const getImages =
  asyncHandler(
    async (req, res) => {

      const images =
        await Gallery.find()
          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,
        data: images,
      });
    }
  );


// UPLOAD IMAGE
// ADMIN ONLY

export const uploadImage =
  asyncHandler(
    async (req, res) => {

      if (!req.file) {
        res.status(400);

        throw new Error(
          "Image is required"
        );
      }

      try {

        const base64Image =
          req.file.buffer.toString(
            "base64"
          );

        const response =
          await axios.post(
            `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
            {
              image: base64Image,
            }
          );

        const imageUrl =
          response.data.data.url;

        const gallery =
          await Gallery.create({
            title:
              req.body.title || "",

            image:
              imageUrl,

            uploadedBy:
              req.user._id,
          });

        res.status(201).json({
          success: true,

          message:
            "Image uploaded successfully",

          data:
            gallery,
        });

      } catch (error) {

        console.error(
          error.response?.data ||
          error.message
        );

        res.status(500);

        throw new Error(
          "Image upload failed"
        );
      }
    }
  );


// DELETE IMAGE
// ADMIN ONLY

export const deleteImage =
  asyncHandler(
    async (req, res) => {

      const image =
        await Gallery.findById(
          req.params.id
        );

      if (!image) {
        res.status(404);

        throw new Error(
          "Image not found"
        );
      }

      await image.deleteOne();

      res.json({
        success: true,

        message:
          "Image deleted successfully",
      });
    }
  );
