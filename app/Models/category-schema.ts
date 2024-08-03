import mongoose, {Schema} from "mongoose";

const categorySchema= new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
        filter:true,
        trim:true
    },
    courses:[{
        type:Schema.Types.ObjectId,
        ref:"Course"
    }]
});

export const Category= mongoose.models.Category || mongoose.model("Category", categorySchema);