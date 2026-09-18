
// import asyncHandler from "express-async-handler";

// import { Ugaai } from "../models/Ugaai.js";


// // ==============================
// // GET ALL RECORDS
// // Public
// // ==============================

// export const getUgaaiList =
//   asyncHandler(
//     async (req, res) => {

//       const members =
//         await Ugaai.find()
//           .sort({ createdAt: -1 });

//       res.json({
//         success: true,
//         count: members.length,
//         data: members,
//       });
//     }
//   );


// // ==============================
// // ADD SINGLE RECORD
// // ADMIN ONLY
// // ==============================

// export const createUgaai =
//   asyncHandler(
//     async (req, res) => {

//       const {
//         date,
//         name,
//         fname,
//         amount,
//         remark,
//         status,
//       } = req.body;

//       if (!name) {
//         res.status(400);

//         throw new Error(
//           "Name is required"
//         );
//       }

//       const member =
//         await Ugaai.create({
//           date,
//           name,
//           fname,
//           amount:
//             Number(amount) || 0,
//           remark,
//           status:
//             status || "active",

//           uploadedBy:
//             req.user._id,
//         });

//       res.status(201).json({
//         success: true,
//         data: member,
//       });
//     }
//   );


// // ==============================
// // BULK CSV DATA UPLOAD
// // ADMIN ONLY
// // ==============================

// export const bulkCreateUgaai =
//   asyncHandler(
//     async (req, res) => {

//       const { members } =
//         req.body;

//       if (
//         !Array.isArray(members) ||
//         members.length === 0
//       ) {
//         res.status(400);

//         throw new Error(
//           "Members data is required"
//         );
//       }

//       const records =
//         members.map((member) => ({

//           date:
//             member.date || "",

//           name:
//             member.name || "",

//           fname:
//             member.fname || "",

//           amount:
//             Number(member.amount) || 0,

//           remark:
//             member.remark || "",

//           status:
//             member.status || "active",

//           uploadedBy:
//             req.user._id,
//         }));

//       const savedMembers =
//         await Ugaai.insertMany(
//           records
//         );

//       res.status(201).json({
//         success: true,

//         message:
//           `${savedMembers.length} records uploaded successfully`,

//         count:
//           savedMembers.length,

//         data:
//           savedMembers,
//       });
//     }
//   );


// // ==============================
// // UPDATE RECORD
// // ADMIN ONLY
// // ==============================

// export const updateUgaai =
//   asyncHandler(
//     async (req, res) => {

//       const member =
//         await Ugaai.findById(
//           req.params.id
//         );

//       if (!member) {
//         res.status(404);

//         throw new Error(
//           "Record not found"
//         );
//       }

//       const fields = [
//         "date",
//         "name",
//         "fname",
//         "amount",
//         "remark",
//         "status",
//       ];

//       fields.forEach((field) => {

//         if (
//           req.body[field] !== undefined
//         ) {

//           if (field === "amount") {
//             member[field] =
//               Number(
//                 req.body[field]
//               ) || 0;

//           } else {
//             member[field] =
//               req.body[field];
//           }
//         }
//       });

//       const updatedMember =
//         await member.save();

//       res.json({
//         success: true,
//         message:
//           "Record updated successfully",
//         data:
//           updatedMember,
//       });
//     }
//   );


// // ==============================
// // DELETE RECORD
// // ADMIN ONLY
// // ==============================

// export const deleteUgaai =
//   asyncHandler(
//     async (req, res) => {

//       const member =
//         await Ugaai.findById(
//           req.params.id
//         );

//       if (!member) {
//         res.status(404);

//         throw new Error(
//           "Record not found"
//         );
//       }

//       await member.deleteOne();

//       res.json({
//         success: true,
//         message:
//           "Record deleted successfully",
//       });
//     }
//   );




import asyncHandler from "express-async-handler";

import { Ugaai } from "../models/Ugaai.js";


// =====================================================
// GET ALL RECORDS
// Public
//
// Example:
// GET /api/ugaai
// GET /api/ugaai?year=2026
// =====================================================

export const getUgaaiList =
  asyncHandler(async (req, res) => {

    const { year } = req.query;

    let filter = {};

    // अगर year दिया गया है
    if (year) {
      const selectedYear = Number(year);

      if (
        !Number.isInteger(selectedYear) ||
        selectedYear < 1900 ||
        selectedYear > 2100
      ) {
        res.status(400);

        throw new Error(
          "Valid year is required"
        );
      }

      filter.year = selectedYear;
    }

    const members = await Ugaai.find(filter)
      .sort({
        year: -1,
        createdAt: -1,
      });

    res.json({
      success: true,
      count: members.length,
      year: year ? Number(year) : null,
      data: members,
    });
  });


// =====================================================
// GET AVAILABLE YEARS
// Public
//
// Example:
// GET /api/ugaai/years
// =====================================================

export const getUgaaiYears =
  asyncHandler(async (req, res) => {

    const years = await Ugaai.distinct("year");

    const sortedYears = years
      .filter(
        (year) =>
          Number.isInteger(year)
      )
      .sort((a, b) => b - a);

    res.json({
      success: true,
      data: sortedYears,
    });
  });


// =====================================================
// ADD SINGLE RECORD
// ADMIN ONLY
// =====================================================

export const createUgaai =
  asyncHandler(async (req, res) => {

    const {
      date,
      name,
      fname,
      amount,
      remark,
      year,
      status,
    } = req.body;

    // =========================
    // NAME VALIDATION
    // =========================

    if (!name || !name.trim()) {
      res.status(400);

      throw new Error(
        "Name is required"
      );
    }

    // =========================
    // YEAR VALIDATION
    // =========================

    const selectedYear = Number(year);

    if (
      !Number.isInteger(selectedYear) ||
      selectedYear < 1900 ||
      selectedYear > 2100
    ) {
      res.status(400);

      throw new Error(
        "Valid year is required"
      );
    }

    // =========================
    // CREATE
    // =========================

    const member = await Ugaai.create({
      date: date || "",

      name: name.trim(),

      fname: fname
        ? fname.trim()
        : "",

      amount:
        Number(amount) || 0,

      remark: remark
        ? remark.trim()
        : "",

      year: selectedYear,

      status:
        status || "active",

      uploadedBy:
        req.user._id,
    });

    res.status(201).json({
      success: true,
      message:
        "डेटा सफलतापूर्वक सेव हो गया",
      data: member,
    });
  });


// =====================================================
// BULK CSV DATA UPLOAD
// ADMIN ONLY
// =====================================================

export const bulkCreateUgaai =
  asyncHandler(async (req, res) => {

    const { members } = req.body;

    if (
      !Array.isArray(members) ||
      members.length === 0
    ) {
      res.status(400);

      throw new Error(
        "Members data is required"
      );
    }

    const records = members.map(
      (member) => {

        const selectedYear =
          Number(member.year);

        if (
          !Number.isInteger(selectedYear) ||
          selectedYear < 1900 ||
          selectedYear > 2100
        ) {
          throw new Error(
            `Invalid year for ${member.name || "record"}`
          );
        }

        return {
          date:
            member.date || "",

          name:
            member.name
              ? member.name.trim()
              : "",

          fname:
            member.fname
              ? member.fname.trim()
              : "",

          amount:
            Number(member.amount) || 0,

          remark:
            member.remark
              ? member.remark.trim()
              : "",

          year:
            selectedYear,

          status:
            member.status || "active",

          uploadedBy:
            req.user._id,
        };
      }
    );

    const savedMembers =
      await Ugaai.insertMany(records);

    res.status(201).json({
      success: true,

      message:
        `${savedMembers.length} records uploaded successfully`,

      count:
        savedMembers.length,

      data:
        savedMembers,
    });
  });


// =====================================================
// UPDATE RECORD
// ADMIN ONLY
// =====================================================

export const updateUgaai =
  asyncHandler(async (req, res) => {

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
      "year",
      "status",
    ];

    fields.forEach((field) => {

      if (
        req.body[field] !== undefined
      ) {

        // =========================
        // AMOUNT
        // =========================

        if (field === "amount") {

          member[field] =
            Number(
              req.body[field]
            ) || 0;

        }

        // =========================
        // YEAR
        // =========================

        else if (field === "year") {

          const selectedYear =
            Number(
              req.body[field]
            );

          if (
            !Number.isInteger(
              selectedYear
            ) ||
            selectedYear < 1900 ||
            selectedYear > 2100
          ) {
            throw new Error(
              "Valid year is required"
            );
          }

          member[field] =
            selectedYear;

        }

        // =========================
        // STRING FIELDS
        // =========================

        else {

          member[field] =
            typeof req.body[field] ===
            "string"
              ? req.body[field].trim()
              : req.body[field];
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
  });


// =====================================================
// DELETE RECORD
// ADMIN ONLY
// =====================================================

export const deleteUgaai =
  asyncHandler(async (req, res) => {

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
  });
