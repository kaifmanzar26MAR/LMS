import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
      trim: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    price: {
      type: Number,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attachment"
      },
    ],
    chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
    pruchases: [
      {
        type: Schema.Types.ObjectId,
        ref: "Purchase",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists to avoid recompilation issues
export const Course =
  mongoose.models.Course || mongoose.model("Course", courseSchema);
