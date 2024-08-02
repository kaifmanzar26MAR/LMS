import { Course } from "@/app/Models/course-sechema";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req:Request,
    {params}: {params:{courseId: string}}
){
    try {
        const {userId}=auth();
        const {courseId}= params;
        const values= await req.json();

        if(!userId){
            return new NextResponse("Unauthorized", {status:401});
        }

        await dbConnect();

        const updatedCourse= await Course.findOneAndUpdate({_id:courseId}, {...values});

        if(!updatedCourse){
            return new NextResponse("Something went wrong in updateing the Course", {status:400});
        }
        console.log("data" , updatedCourse);
        return NextResponse.json(updatedCourse);

    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internel Error", {status:500});
    }
}