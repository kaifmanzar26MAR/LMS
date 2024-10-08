import mongoose, { Schema } from "mongoose";
import { MuxData } from "./muxdata-schema";
import { UserProgress } from "./userprogress-schema";
import { boolean } from "zod";

const chapterSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    courseId:{
        type:Schema.Types.ObjectId,
        ref:"Course"
    },
    description:{
        type:String,
    },
    videoUrl:{
        type:String,
    },
    position:{
        type:Number,
    },
    isPublished:{
        type:Boolean,
        required:true,
        default:false
    },
    isFree:{
        type:Boolean,
        required:true,
        default:false
    },
    muxData:{
        type:Schema.Types.ObjectId,
        ref:"MuxData"
    },
    userProgress:[{
        type:Schema.Types.ObjectId,
        ref:"UserProgress"
    }],
    isCompleted:{
        type:Boolean,
        default:false,
    }
},
{
    timestamps:true
});


export const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', chapterSchema);