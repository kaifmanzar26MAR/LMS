import { Chapter } from "@/app/Models/chapter-schmea";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req:Request,{params}:{params:{courseId:string, chapterId:string}}) {
    try {
        const {userId} = auth();
        if(!userId){
            return new NextResponse("Unauthorized!!", {status:400})
        }

        const chapter= await Chapter.findOne({_id:params.chapterId, courseId:params.courseId});

        if(!chapter){
            return new NextResponse("No Chapter Found!!", {status:400})
        }

        return NextResponse.json(chapter);
    } catch (error) {
        console.log('[CHAPTER]'+ error);
        return new NextResponse("Chapter error!!" + error, {status:500})
    }
}