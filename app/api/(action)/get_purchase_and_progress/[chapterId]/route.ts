import { Purchase } from "@/app/Models/purchase-schema";
import { UserProgress } from "@/app/Models/userprogress-schema";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { courseId, chapterId } = await req.json();

    await dbConnect();

    const isPurchase = await Purchase.findOne({ userId, courseId });

    if (!isPurchase) {
      return NextResponse.json({ isPurchase: false });
    }

    const progress = await UserProgress.findOne({ chapterId });

    console.log(progress);
    return NextResponse.json({ isPurchase: true, progress });
  } catch (error) {
    console.log("ERROR PURCHASE OR PROGRESS" + error);
    return new NextResponse("Error in purchase or progress!!" + error, {
      status: 500,
    });
  }
}
