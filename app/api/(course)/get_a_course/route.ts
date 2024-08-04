import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {Course} from "@/app/Models/course-sechema"
import dbConnect from "@/lib/dbConnect";
export async function POST( req :Request,){
    try {
        const {userId} = auth(); //getting userId from the clreak auth
        const {_id} = await req.json();

        await dbConnect();


        if(!userId){
            return new NextResponse("Unauthhorized", {status:401});
        }

        if(_id.trim('')===''){
            return new NextResponse("id is required!", {status: 401});
        }

        const course= await Course.findOne({_id:_id}).populate({
            path: 'attachments',
            options: { sort: { createdAt: -1 } } ,
            strictPopulate: false
          });

        if(!course){
            return new NextResponse("No Course found by given id!", {status:401})
        }
        console.log(course)
        return NextResponse.json(course);

    } catch (error) {
        console.log("[COURSES]", error);
        return new  NextResponse("Internal Error", {status:500})
    }
}

