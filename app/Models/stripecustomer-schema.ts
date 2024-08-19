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


export const StripeCustomer= mongoose.models.StripeCustomer || mongoose.model("StripeCustomer", stripeCustomerSchema);