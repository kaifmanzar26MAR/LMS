import mongoose, { Schema } from "mongoose";
import { MuxData } from "./muxdata-schema";
import { UserProgress } from "./userprogress-schema";

const chapterSchema= new Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    description:{
        type:String,
    },
    videoUrl:{
        type:String,
        required:true
    },
    position:{
        type:Number,
        required:true
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
    muxData:MuxData,
    useProgress:[UserProgress],
},
{
    timestamps:true
});


export const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', chapterSchema);