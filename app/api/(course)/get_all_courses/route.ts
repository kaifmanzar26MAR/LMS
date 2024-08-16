import { Course } from "@/app/Models/course-sechema";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
    try {
        const {userId}=auth();
        if(!userId){
            return new NextResponse("No user found!!", {status:400});
        }
        await dbConnect();

        const courses = await Course.find({ userId: userId }).sort({ createdAt: -1 });
        console.log(courses)
        if(!courses){
            return new NextResponse("Something went worng in fetching courses!", {status:400})
        }

        return NextResponse.json(courses)
    } catch (error) {
        console.log("[COURSE ERROR FETCH] error "+ error);
        return new NextResponse("Error in fecthing "+ error, {status:500})
    }
}