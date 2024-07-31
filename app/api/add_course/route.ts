import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {Course} from "@/app/Models/course-sechema"
import dbConnect from "@/lib/dbConnect";
export async function POST( req :Request,){
    try {
        const {userId} = auth(); //getting userId from the clreak auth
        const {title} = await req.json();

        await dbConnect();


        if(!userId){
            return new NextResponse("Unauthhorized", {status:401});
        }

        if(title.trim('')===''){
            return new NextResponse("Title is required!", {status: 401});
        }

        const newCourse= await Course.create({
            title,
            userId
        });

        if(!newCourse){
            return new NextResponse("Something went worng in creation of Course", {status:401})
        }
        console.log(newCourse)
        return NextResponse.json(newCourse);

    } catch (error) {
        console.log("[COURSES]", error);
        return new  NextResponse("Internal Error", {status:500})
    }
}

