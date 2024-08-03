import { Category } from "@/app/Models/category-schema";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
    await dbConnect();
    const allCategories= await Category.aggregate([
        {
          '$project': {
            '_id': 1, 
            'name': 1
          }
        }
      ]);

    if(!allCategories) return new NextResponse("Something went worng in fetching categories!!", {status:400})
    
    return NextResponse.json(allCategories);
}