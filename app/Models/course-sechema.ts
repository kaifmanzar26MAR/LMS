import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
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
}, {
    timestamps: true,
});

// Check if the model already exists to avoid recompilation issues
export const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
