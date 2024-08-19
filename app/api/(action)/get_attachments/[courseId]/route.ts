import { Attachment } from "@/app/Models/attachment-schema";
import { Purchase } from "@/app/Models/purchase-schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();
    if(!user || !user.id){
      console.log("no user found by clear current user in get attachmets")
      return new NextResponse('Unauthorized user', {status:500})
    }
    console.log("user id", user.id);
    const isPurchased = await Purchase.findOne({
      userId:user.id,
      courseId: params.courseId,
    });
    console.log("ispurchase form attachments",isPurchased , params.courseId)
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
