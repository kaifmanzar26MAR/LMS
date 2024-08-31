import mongoose, { Schema } from "mongoose";

const purchaseSchema= new Schema({
    userId:{
        type:String,
        required:true,
    },
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }
},{
    timestamps:true,
})

export const Purchase= mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema)