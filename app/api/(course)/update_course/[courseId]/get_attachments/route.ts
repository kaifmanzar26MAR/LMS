import { Attachment } from "@/app/Models/attachment-schema";
import { NextResponse } from "next/server";

export async function GET(req:Request, {params}: {params: {courseId:string}}) {
    const allAttachments= await Attachment.find({courseId:params.courseId});
    if(!allAttachments){
        return new NextResponse("Couldn't found attachments", {status:401})
    }
    return NextResponse.json(allAttachments);
}