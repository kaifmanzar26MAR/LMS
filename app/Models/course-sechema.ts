"use server"
import mongoose, {Schema} from "mongoose";

const courseSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    imageUrl:{
        type:String
    },
    price:{
        type:String
    },
    isPublished:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
});

export const Course = mongoose.model('Course', courseSchema);