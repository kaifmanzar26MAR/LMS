import { Purchase } from "@/app/Models/purchase-schema";
import { UserProgress } from "@/app/Models/userprogress-schema";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    try {
        const {userId}=auth();
        const {courseId, chapters}= await req.json();
       
        console.log("cahpters and cid", chapters, courseId);
        await dbConnect();

        const isPurchase=await Purchase.findOne({userId, courseId});

        if(!isPurchase){
            return NextResponse.json({isPurchase:false, progresses:[]});
        }
        if(!chapters || chapters.length===0){
            return NextResponse.json({isPurchase:true, progresses:[] })
        }
        const progresses = await Promise.all(
            chapters.map(async (chapter: any) => {
              const pro = await UserProgress.findOne({ chapterId: chapter._id });
          
              if (!pro) {
                return {
                  isCompleted: false,
                  _id: "null",
                };
              }
          
              return {
                isCompleted: pro.isCompleted,
                _id: pro._id,
              };
            })
          );
          
        console.log("progesses", progresses)
        return NextResponse.json({isPurchase:true, progresses:progresses})

        
    } catch (error) {
        console.log("ERROR PURCHASE OR PROGRESS"+error);
        return new NextResponse("Error in purchase or progress!!"+error, {status:500})
    }
}       