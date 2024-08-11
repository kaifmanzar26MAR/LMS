import { Chapter } from "@/app/Models/chapter-schmea";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req:Request, {params}: {params:{courseId: string, chapterId:string}}) {
    try {
        const {userId}=auth();
        const values= await req.json();
        
        await dbConnect();
    
        const chapter=await Chapter.findOne({_id:params.chapterId, courseId:params.courseId});
    
        if(!chapter){
            return new NextResponse("No chpater found!!", {status:400});
        }
    
        const updatedchapter=await Chapter.findOneAndUpdate({_id:params.chapterId, courseId:params.courseId},{...values});
    
        if(!updatedchapter){
            return new NextResponse("Something went wrong in updating chapter!!", {status:400})
        }
        
        return NextResponse.json(updatedchapter);
    } catch (error) {
        console.log("[CHAPTER] update error "+ error);
        return new NextResponse("Chapter update Error "+ error, {status: 500})
    }
}