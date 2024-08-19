import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import dbConnect from "@/lib/dbConnect";
import { Purchase } from "@/app/Models/purchase-schema";

export async function POST(req:Request) {
    const body= await req.text();
    const signatrue= headers().get("Stripe-Signature") as string;
    await dbConnect();
    let event: Stripe.Event;

    try {
        event= stripe.webhooks.constructEvent(
            body,
            signatrue,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        console.log("ERROR webhook"+error);
        return new NextResponse(`WebHook ERROR: ${error.message}`, {status:400})
    }
    

    const session= event.data.object as Stripe.Checkout.Session;
    const userId= session?.metadata?.userId;
    const courseId= session?.metadata?.courseId;

    if(event.type==="checkout.session.completed"){
        if(!userId || !courseId){
            return new NextResponse("Webhook error: Missing Metadata", {status:400})
        }
        await Purchase.create({
            courseId,
            userId
        })
    }else {
        return new NextResponse("WebHook Error: Unhandeld event type " + event.type , {status: 200}) // maximum 400 error will stop the stripe automatically
    }

    return new NextResponse(null, {status:200}) // the previous mark status with 200 will not break the code, so for this we use this error
}