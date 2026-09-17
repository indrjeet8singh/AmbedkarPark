
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
     year: {
      type: number,
      required:true,
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

export const Ugaai = mongoose.model(
  "Ugaai",
  ugaaiSchema
);
