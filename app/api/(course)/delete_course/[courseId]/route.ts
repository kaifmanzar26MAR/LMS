import { Course } from "@/app/Models/course-sechema";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(req:Request, {params}:{params:{courseId:string}}) {
    try {
        const {userId}= auth();
        await dbConnect();
        const deleteCourseInstance=  await Course.findOneAndDelete({_id:params.courseId, userId:userId})
        if(!deleteCourseInstance){
            return new NextResponse("Something went wrong in Deletion of Course!!", {status:400})
        }
        return NextResponse.json(deleteCourseInstance);
    } catch (error) {
        console.log("[DELETE COURSE] error"+ error);
        return new NextResponse("Error in Deleteing "+ error, {status:500})
    }
}