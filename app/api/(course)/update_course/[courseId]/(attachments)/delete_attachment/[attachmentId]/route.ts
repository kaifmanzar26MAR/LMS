import { Attachment } from "@/app/Models/attachment-schema";
import { Course } from "@/app/Models/course-sechema";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function DELETE(req:Request,
    {params}:{params: {courseId: string, attachmentId: string}}
) {
    try {
        // console.log(params);
        const course = await Course.findOne({ _id: params.courseId });
        if (!course) {
            return new NextResponse("No Course Found!!", { status: 404 });
        }
        
        const attachment = await Attachment.findOne({ _id: params.attachmentId });
        if (!attachment) {
            return new NextResponse("No Attachment Found!!", { status: 404 });
        }
        await dbConnect();


        const updatedAttachments = course.attachments.filter((e:{_id:string}) => e._id !== params.attachmentId);
        console.log("updated attch",updatedAttachments)
        course.attachments = updatedAttachments;
        
        await Attachment.findOneAndDelete({ _id: params.attachmentId });
        await course.save();
        
        return new NextResponse("Attachment Deleted!!", { status: 200 });
    } catch (error) {
        console.error("Error while deleting attachment:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}