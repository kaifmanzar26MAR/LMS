import { Chapter } from "@/app/Models/chapter-schmea";
import { NextResponse } from "next/server";

export async function GET(req:Request, {params}:{params:{courseId:string}}) {
    console.log(params.courseId);
    try {
        const allChapters= await Chapter.find({courseId:params.courseId}).sort({position:1});

        if(!allChapters){
            return new NextResponse("Not found Data", {status:400});
        }

        return NextResponse.json(allChapters);
    } catch (error) {
        console.log(`[Course Chapter] error ${error}`);
        return new NextResponse("Error"+ error, {status:400})
    }
}