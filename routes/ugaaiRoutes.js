
// import express from "express";

// import {
//   getUgaaiList,
//   createUgaai,
//   bulkCreateUgaai,
//   updateUgaai,
//   deleteUgaai,
// } from "../controllers/ugaaiController.js";

// import {
//   protect,
//   authorizeRoles,
// } from "../middleware/authMiddleware.js";

// const router = express.Router();


// // सभी लोग देख सकते हैं
// router.get(
//   "/",
//   getUgaaiList
// );


// // केवल Admin Add कर सकता है
// router.post(
//   "/",
//   protect,
//   authorizeRoles("admin"),
//   createUgaai
// );


// // केवल Admin CSV data upload कर सकता है
// router.post(
//   "/bulk",
//   protect,
//   authorizeRoles("admin"),
//   bulkCreateUgaai
// );


// // केवल Admin Edit कर सकता है
// router.put(
//   "/:id",
//   protect,
//   authorizeRoles("admin"),
//   updateUgaai
// );


// // केवल Admin Delete कर सकता है
// router.delete(
//   "/:id",
//   protect,
//   authorizeRoles("admin"),
//   deleteUgaai
// );

// export default router;



import express from "express";

import {
  getUgaaiList,
  getUgaaiYears,
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


// =====================================================
// PUBLIC ROUTES
// =====================================================

// सभी लोग Ugaai list देख सकते हैं
//
// सभी साल:
// GET /api/ugaai
//
// किसी एक साल की list:
// GET /api/ugaai?year=2026
router.get(
  "/",
  getUgaaiList
);


// =====================================================
// AVAILABLE YEARS
// =====================================================

// Database में जिन-जिन वर्षों का data मौजूद है
// वह list मिलेगी
//
// GET /api/ugaai/years
router.get(
  "/years",
  getUgaaiYears
);


// =====================================================
// ADMIN ONLY
// =====================================================

// केवल Admin नया member add कर सकता है
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createUgaai
);


// केवल Admin CSV / Bulk data upload कर सकता है
router.post(
  "/bulk",
  protect,
  authorizeRoles("admin"),
  bulkCreateUgaai
);


// केवल Admin member edit कर सकता है
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateUgaai
);


// केवल Admin member delete कर सकता है
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteUgaai
);


export default router;
