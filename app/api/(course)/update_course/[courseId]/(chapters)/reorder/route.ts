import { Chapter } from "@/app/Models/chapter-schmea";
import { Course } from "@/app/Models/course-sechema";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(req:Request, {params}:{params: {courseId:string}}) {
    try {

        const {userId}=auth();
        
        if(!userId){
            return new NextResponse("Unauthorized", {status:401});
        }

        const {list}= await req.json();
        console.log(list)

        await dbConnect();

        const ownerCourse= await Course.findOne({_id:params.courseId, userId:userId})

        if(!ownerCourse){
            return new NextResponse("Unauthorized", {status:401});
        }

        for(let items of list){
            await Chapter.updateOne(
                { _id: items._id, courseId: params.courseId },
                { $set: { position: items.position } }
            );
        }

        return new NextResponse("Possition updated!!", {status:200})
        
    } catch (error) {
        console.log("[REORDER CHAPTER]", error);
        return new NextResponse("Reorder error" + error, {status:500});
    }
}