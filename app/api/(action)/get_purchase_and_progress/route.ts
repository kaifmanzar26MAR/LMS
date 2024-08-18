import { Purchase } from "@/app/Models/purchase-schema";
import { UserProgress } from "@/app/Models/userprogress-schema";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    try {
        const {userId}=auth();
        const {courseId, chapters}= await req.json();

        await dbConnect();

        const isPurchase=await Purchase.findOne({userId, courseId});

        if(!isPurchase){
            return NextResponse.json({isPurchase:false});
        }


        const progresses= await Promise.all(chapters.map((chapter:any)=>{
                return UserProgress.findOne({chapterId:chapter._id})
        }))
console.log(progresses)
        return NextResponse.json({isPurchase:true, progresses})

        
    } catch (error) {
        console.log("ERROR PURCHASE OR PROGRESS"+error);
        return new NextResponse("Error in purchase or progress!!"+error, {status:500})
    }
}       