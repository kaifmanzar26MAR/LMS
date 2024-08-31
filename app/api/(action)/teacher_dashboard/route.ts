import { Course } from "@/app/Models/course-sechema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
    try {
        const {userId}= auth();
        const soldCourses= await Course.find({userId: userId, isPublished: true});
        console.log(soldCourses);
        let totalRevinew= 0;
        let data=[{}];
        data.pop();
        soldCourses.forEach((element) => {
            const revinewByCourse= element.price * element.pruchases.length;
            totalRevinew += revinewByCourse;

            data.push({
                name: element.title,
                total: revinewByCourse,
            })
        });
        return NextResponse.json({
            data,
            totalRevinew,
            soldCourses,
            status:200
        });
    } catch (error) {
        console.log(error);
        return new NextResponse("ERROR in Teacher dashboard!"+ error, {status:500})
    }
}