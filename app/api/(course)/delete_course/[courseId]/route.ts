import { Attachment } from "@/app/Models/attachment-schema";
import { Chapter } from "@/app/Models/chapter-schmea";
import { Course } from "@/app/Models/course-sechema";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = auth();
        await dbConnect();
        
        console.log("Deleting chapters...");

        // Fetch all chapters for the course
        const allChapterOfCourse = await Chapter.find({ courseId: params.courseId });
        
        if (allChapterOfCourse.length) {
            try {
                // Delete each chapter by making a DELETE request
                await Promise.all(
                    allChapterOfCourse.map((chapter) =>
                        axios.delete(`http://localhost:3000/api/update_course/${params.courseId}/${chapter._id}/delete_chapter`)
                    )
                );
            } catch (chapterDeleteError) {
                console.error("Error deleting chapters:", chapterDeleteError);
                // return new NextResponse("Failed to delete chapters.", { status: 500 });
            }
        }

        console.log("Deleting attachments...");

        // Delete all attachments related to the course
        await Attachment.deleteMany({ courseId: params.courseId });

        // Delete the course itself
        const deleteCourseInstance = await Course.findOneAndDelete({ _id: params.courseId, userId });

        if (!deleteCourseInstance) {
            return new NextResponse("Course not found or unauthorized.", { status: 404 });
        }

        return NextResponse.json(deleteCourseInstance);

    } catch (error) {
        console.error("[DELETE COURSE] Error:", error);
        return new NextResponse(`Error in deleting course: ${error}`, { status: 500 });
    }
}
