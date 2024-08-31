import { Course } from "@/app/Models/course-sechema";
import { Purchase } from "@/app/Models/purchase-schema";
import { StripeCustomer } from "@/app/Models/stripecustomer-schema";
import dbConnect from "@/lib/dbConnect";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();
    await dbConnect();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized!!", { status: 401 });
    }

    const course = await Course.findOne({
      _id: params.courseId,
      isPublished: true,
    });
    const isAlreadyPurchased = await Purchase.findOne({
      userId: user.id,
      courseId: params.courseId,
    });
    if(isAlreadyPurchased){
        return new NextResponse("Already Purchased", {status:400})
    }

    if(!course){
        return new NextResponse("Not Found Couses", {status:404})
    }

    const line_items:Stripe.Checkout.SessionCreateParams.LineItem[]=[{
        quantity:1,
        price_data:{
            currency:"USD",
            product_data:{
                name:course.title,
                description:course.description!,
            },
            unit_amount:Math.round(course.price!*100),
        },

    }]

    let stripeCustomer= await StripeCustomer.findOne({userId:user.id}).select('stripeCustomerId');

    if(!stripeCustomer){
        const customer= await stripe.customers.create({
            email:user.emailAddresses[0].emailAddress,
        });

        stripeCustomer= await StripeCustomer.create({
            userId:user.id,
            stripeCustomerId:customer.id
        });
    }
    const session= await stripe.checkout.sessions.create({
        customer:stripeCustomer.stripeCustomerId,
        line_items,
        mode:'payment',
        success_url:`${process.env.NEXT_PUBLIC_APP_URL}/courses/${course._id}?sucess=1`,
        cancel_url:`${process.env.NEXT_PUBLIC_APP_URL}/courses/${course._id}?canceled=1`,
        metadata:{
            courseId:params.courseId,
            userId:user.id,
        }
    })
    if(session){
      course.pruchases.append(user.id);
      course.save();
    }
    return NextResponse.json({url:session.url});
  } catch (error) {
    console.log("Payment Error" + error);
    return new NextResponse("Payment error " + error, { status: 500 });
  }
}
