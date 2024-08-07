import { Chapter } from "@/app/Models/chapter-schmea";
import { Course } from "@/app/Models/course-sechema";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req:Request, {params}:{params:{courseId:string}}) {
    try {
        const {title}=await req.json();
        const {userId}= auth();
        if([title].some(field=>field.trim('')==='')){
            return new NextResponse("Title is Required!!", {status:401})
        }
        if(!userId){
            return new NextResponse("Unauthorized!", {status:401})
        }

        await dbConnect();

        const courseOwner= await Course.findOne({_id:params.courseId, userId:userId})

        if(!courseOwner){
            return new NextResponse("Unauthorized!!", {status:401})
        }

        const newPossition= courseOwner.chapters.length;

        const newChapter= await Chapter.create({
            title,
            courseId:params.courseId,
            position:newPossition
        });

        if(!newChapter){
            return new NextResponse("Something went worng in creation of Chapter!!", {status:401})
        }

        courseOwner.chapters.push(newChapter._id);
        await courseOwner.save();

        return NextResponse.json(newChapter);

    } catch (error) {
        console.log('[COURSE-CHAPTER]',error);
        return new NextResponse("Internel error "+ error, {status:500})
    }
}