import { Attachment } from "@/app/Models/attachment-schema";
import { Purchase } from "@/app/Models/purchase-schema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const isPurchased = await Purchase.findOne({
      userId,
      courseId: params.courseId,
    });
    if (isPurchased) {
      const allAttachments = await Attachment.find({
        courseId: params.courseId,
      });
      if (!allAttachments) {
        return new NextResponse("Couldn't found attachments", { status: 401 });
      }
      return NextResponse.json(allAttachments);
    }else{
        return new NextResponse("Not Purchsed!!", {status:400})
    }
  } catch (error) {
    console.log("Attachments Error!!", error )
    return new NextResponse("Attachemnts error"+ error, {status:500})
  }
}
