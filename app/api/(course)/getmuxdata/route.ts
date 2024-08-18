import { MuxData } from "@/app/Models/muxdata-schema";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    try {
        const {chapterId, _id}= await req.json();
        const muxdata= await MuxData.find({chapterId,_id });
        if(!muxdata){
            return new NextResponse("No Mux Data found!!", {status:400});
        }
        return NextResponse.json(muxdata);
    } catch (error) {
        console.log(`[MUXDATA] error`, error);
        return new NextResponse("Error in MuxData fetching!!"+error, {status:400})
    }
}