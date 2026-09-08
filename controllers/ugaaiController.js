
import asyncHandler from "express-async-handler";

import { Ugaai } from "../models/Ugaai.js";


// ==============================
// GET ALL RECORDS
// Public
// ==============================

export const getUgaaiList =
  asyncHandler(
    async (req, res) => {

      const members =
        await Ugaai.find()
          .sort({ createdAt: -1 });

      res.json({
        success: true,
        count: members.length,
        data: members,
      });
    }
  );


// ==============================
// ADD SINGLE RECORD
// ADMIN ONLY
// ==============================

export const createUgaai =
  asyncHandler(
    async (req, res) => {

      const {
        date,
        name,
        fname,
        amount,
        remark,
        status,
      } = req.body;

      if (!name) {
        res.status(400);

        throw new Error(
          "Name is required"
        );
      }

      const member =
        await Ugaai.create({
          date,
          name,
          fname,
          amount:
            Number(amount) || 0,
          remark,
          status:
            status || "active",

          uploadedBy:
            req.user._id,
        });

      res.status(201).json({
        success: true,
        data: member,
      });
    }
  );


// ==============================
// BULK CSV DATA UPLOAD
// ADMIN ONLY
// ==============================

export const bulkCreateUgaai =
  asyncHandler(
    async (req, res) => {

      const { members } =
        req.body;

      if (
        !Array.isArray(members) ||
        members.length === 0
      ) {
        res.status(400);

        throw new Error(
          "Members data is required"
        );
      }

      const records =
        members.map((member) => ({

          date:
            member.date || "",

          name:
            member.name || "",

          fname:
            member.fname || "",

          amount:
            Number(member.amount) || 0,

          remark:
            member.remark || "",

          status:
            member.status || "active",

          uploadedBy:
            req.user._id,
        }));

      const savedMembers =
        await Ugaai.insertMany(
          records
        );

      res.status(201).json({
        success: true,

        message:
          `${savedMembers.length} records uploaded successfully`,

        count:
          savedMembers.length,

        data:
          savedMembers,
      });
    }
  );


// ==============================
// UPDATE RECORD
// ADMIN ONLY
// ==============================

export const updateUgaai =
  asyncHandler(
    async (req, res) => {

      const member =
        await Ugaai.findById(
          req.params.id
        );

      if (!member) {
        res.status(404);

        throw new Error(
          "Record not found"
        );
      }

      const fields = [
        "date",
        "name",
        "fname",
        "amount",
        "remark",
        "status",
      ];

      fields.forEach((field) => {

        if (
          req.body[field] !== undefined
        ) {

          if (field === "amount") {
            member[field] =
              Number(
                req.body[field]
              ) || 0;

          } else {
            member[field] =
              req.body[field];
          }
        }
      });

      const updatedMember =
        await member.save();

      res.json({
        success: true,
        message:
          "Record updated successfully",
        data:
          updatedMember,
      });
    }
  );


// ==============================
// DELETE RECORD
// ADMIN ONLY
// ==============================

export const deleteUgaai =
  asyncHandler(
    async (req, res) => {

      const member =
        await Ugaai.findById(
          req.params.id
        );

      if (!member) {
        res.status(404);

        throw new Error(
          "Record not found"
        );
      }

      await member.deleteOne();

      res.json({
        success: true,
        message:
          "Record deleted successfully",
      });
    }
  );
