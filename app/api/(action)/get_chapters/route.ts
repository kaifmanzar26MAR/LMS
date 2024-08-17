import { Chapter } from "@/app/Models/chapter-schmea";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    try {
        await dbConnect();
        const { ids } = await req.json();
    
        // Ensure the ids are valid MongoDB ObjectIds
        const validIds = ids.map((id:string )=> new mongoose.Types.ObjectId(id));
    
        // Find chapters with the provided ids
        const chapters = await Chapter.find({ _id: { $in: validIds }, isPublished:true });
        return NextResponse.json(chapters);
      } catch (error) {
        console.error(error);
        return new NextResponse("Error in Chapters!!"+error, {status:500})
      }
}