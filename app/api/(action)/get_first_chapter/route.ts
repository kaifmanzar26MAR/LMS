import { Chapter } from "@/app/Models/chapter-schmea";
import { Course } from "@/app/Models/course-sechema";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    try {
        await dbConnect();  
        const courseId=await req.json();
    
        // Ensure the ids are valid MongoDB ObjectIds
        console.log(courseId)
        const course= await Course.findOne({_id:courseId.courseId});
        console.log("course ", course);
        const validIds=course.chapters;
        // Find chapters with the provided ids
        const chapters = await Chapter.find({ _id: { $in: validIds }, isPublished:true }).sort({position:1});
        console.log(chapters)
        return NextResponse.json(chapters);
      } catch (error) {
        console.error(error);
        return new NextResponse("Error in Chapters!!"+error, {status:500})
      }
}