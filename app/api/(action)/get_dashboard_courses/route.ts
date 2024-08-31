
import { Chapter } from "@/app/Models/chapter-schmea";
import { Course } from "@/app/Models/course-sechema";
import { Purchase } from "@/app/Models/purchase-schema";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    try {
        const {userId}= auth();
        console.log(userId);
        await dbConnect();
        const allPurchase=await Purchase.find({userId: userId});
        // console.log(allPurchase);
        const allData=await  Promise.all(allPurchase.map(async(item)=>{
            return await Course.findById({_id: item.courseId});
        }))
        // console.log("all ", allData)
        const courseCompleteProgress = await Promise.all(allData.map(async (item) => {
            let isCompleted = true;
        
            for (const chap of item.chapters) {
                const chapData = await Chapter.findById({ _id: chap });
                if (!chapData || chapData.isCompleted === false) {
                    isCompleted = false;
                    break;  // No need to check further chapters if one is incomplete
                }
            }
        
            if (!isCompleted) {
                console.log("Not completed:", item);
                return { isCompleted: false, course: item };
            } else {
                console.log("Completed:", item);
                return { isCompleted: true, course: item };
            }
        }));
        
        console.log("Completed Courses:", courseCompleteProgress);
        
        return NextResponse.json({allPurchase, allData, courseCompleteProgress, status:200});
    } catch (error) {
        console.log(error);
        return new NextResponse("Error in dashboard chapters!!"+error, {status:500})
    }
}