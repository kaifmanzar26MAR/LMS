import { Attachment } from "@/app/Models/attachment-schema";
import { Course } from "@/app/Models/course-sechema";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req:Request, {params}: {params: {courseId:string}}) {
    try {
        const {userId}= auth();
        const {url}= await req.json();

        if(!userId){
            return new NextResponse("Unauthorized", {status:401});
        }

        if(url.trim('')===''){
            return new NextResponse("Url is required!!", {status:401});
        }
        

        await dbConnect();

        const courseOwner = await Course.findOne({
            _id: params.courseId,
            userId: userId
        });


        if(!courseOwner){
            return new NextResponse("Unauthorized user!!", {status:401});
        }

        const newAttachment= await Attachment.create({
            url,
            name:url.split('/').pop(),
            courseId:params.courseId
        });

        if(!newAttachment){
            return new NextResponse("Something went wrong in adding attachments!!", {status:401});
        }

        if (!courseOwner.attachments) {
            courseOwner.attachments = [];
        }

        courseOwner.attachments.push(newAttachment._id);
        const updatedCourse = await courseOwner.save();

        console.log("updated ",updatedCourse);

        if(!updatedCourse)  return new NextResponse("Something went worng in course updation!!", {status:401});
        
        return  NextResponse.json(updatedCourse);

    } catch (error) {
        console.log("COURSE_ID_ATTACHMENTS", error);
        return new NextResponse("Internal Error!!", {status:500});
    }
}