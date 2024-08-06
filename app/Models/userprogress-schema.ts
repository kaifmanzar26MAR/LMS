import mongoose, { Schema } from "mongoose";

const userProgressSchema= new Schema({
    userId:{
        type:String,
        required:true
    },
    chapterId:{
        type:Schema.Types.ObjectId,
        ref:"Chapter"
    },
    isCompleted:{
        type:Boolean,
        required:true,
        default:false
    }
},{
    timestamps:true
});

export const UserProgress= mongoose.models.UserProgress || mongoose.model("UserProgress", userProgressSchema);