
// import mongoose from "mongoose";

// const ugaaiSchema = new mongoose.Schema(
//   {
//     date: {
//       type: String,
//       default: "",
//     },

//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     fname: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     amount: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     remark: {
//       type: String,
//       default: "",
//     },
//     status: {
//       type: String,
//       enum: ["active", "deceased"],
//       default: "active",
//     },

//     uploadedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export const Ugaai = mongoose.model(
//   "Ugaai",
//   ugaaiSchema
// );



import mongoose from "mongoose";

const ugaaiSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      default: "",
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    fname: {
      type: String,
      default: "",
      trim: true,
    },

    amount: {
      type: Number,
      default: 0,
      min: 0,
    },

    remark: {
      type: String,
      default: "",
    },

    // =========================
    // YEAR
    // =========================
    year: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "deceased"],
      default: "active",
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Year के हिसाब से तेजी से data निकालने के लिए index
ugaaiSchema.index({ year: 1, createdAt: -1 });

export const Ugaai = mongoose.model(
  "Ugaai",
  ugaaiSchema
);
