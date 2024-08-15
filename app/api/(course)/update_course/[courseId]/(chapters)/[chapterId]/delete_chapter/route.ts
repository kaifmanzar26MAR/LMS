import { Chapter } from "@/app/Models/chapter-schmea";
import { Course } from "@/app/Models/course-sechema";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(req:Request, {params}:{params:{courseId:string, chapterId:string}}) {
    try {
        const {userId}=auth();
        await dbConnect();
        console.log(params.chapterId, params.courseId)
        const course= await Course.findOne({_id:params.courseId})
        if(!course){
            return new NextResponse("Error in Finding Chapter!!", {status:400});
        }
        const updateCourseChapterIds= course?.chapters.filter((ids:string)=>{
            console.log(ids)
            if(ids!=params.chapterId){
                return ids
            }
        })
        console.log(updateCourseChapterIds);
        const deleteInstance= await Chapter.findOneAndDelete({_id:params.chapterId, courseId:params.courseId});
        if(!deleteInstance){
            return new NextResponse("Error in Deleting Chapter!!", {status:400});
        
        }
        course.chapters= updateCourseChapterIds;
        await course.save();
        return NextResponse.json(deleteInstance)
    } catch (error) {
        console.log(error)
        return new NextResponse("[DELTE CHAPTER] ERROR"+ error, {status:500})
    }
}