import { Chapter } from "@/app/Models/chapter-schmea";
import { Course } from "@/app/Models/course-sechema";
import { MuxData } from "@/app/Models/muxdata-schema";
import { UserProgress } from "@/app/Models/userprogress-schema";
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
        await MuxData.findOneAndDelete({
            _id: course.muxData,
            chapterId: params.chapterId
          });
          
        // if(!deleteChapterMuxInstance){
        //     console.log("mux erro")
        //     return new NextResponse("Error in Deleting MuxData!!", {status:400});
        // }
        await UserProgress.deleteMany({chapterId:params.chapterId, userId:userId});
        // if(!deleteUserProgressInstance){
        //     console.log("prog erro")
        //     return new NextResponse("Error in Deleting User Progress", {status:400});
        // }
        const deleteChapterInstance= await Chapter.findOneAndDelete({_id:params.chapterId, courseId:params.courseId});
        if(!deleteChapterInstance){
            console.log("cahpter erro")
            return new NextResponse("Error in Deleting Chapter!!", {status:400});
        }
        course.chapters= updateCourseChapterIds;
        await course.save();
        return NextResponse.json(deleteChapterInstance)
    } catch (error) {
        console.log(error)
        return new NextResponse("[DELTE CHAPTER] ERROR"+ error, {status:500})
    }
}