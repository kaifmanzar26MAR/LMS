import { Category } from "@/app/Models/category-schema";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";


export async function POST(req:Request){
    try {
        const {name}=await req.json();
        console.log(name)
        await dbConnect();

        if(name.trim('')===""){
            return new NextResponse("Category Name is Required!!", {status:400});
        }

        const newCategory= await Category.create({
            name:name
        });

        if(!newCategory) return new NextResponse("Something went worng in category creation!!", {status:400})
        
        return NextResponse.json({newCategory, status:200})
    } catch (error) {
        console.log(error);
        return new NextResponse("Internel Error", {status:400});
    }
}