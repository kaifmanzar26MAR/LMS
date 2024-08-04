import mongoose,{Schema} from "mongoose";

const attachmentSchema=new Schema({
    name:{
        type:String,
        required:true,
        index:true,
        trim:true
    },
    courseId:{
        type:Schema.Types.ObjectId,
        ref:"Course",
        required:true
    },
    url:{
        type:String,
        required:true,
    },
},
{
    timestamps:true
})



export const Attachment=mongoose.models.Attachment  || mongoose.model("Attachment", attachmentSchema);
