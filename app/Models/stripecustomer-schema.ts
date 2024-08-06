import mongoose, { Schema } from "mongoose";

const stripeCustomerSchema= new Schema({
    userId:{
        type:String,
        required:true
    },
    stripeCustomerId:{
        type:String,
        unique:true,
    }
},
{
    timestamps:true,
})


const StripeCustomer= mongoose.models.StripeCustomer || mongoose.model("StripeCustomer", stripeCustomerSchema);