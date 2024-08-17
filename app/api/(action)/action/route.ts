import { Chapter } from "@/app/Models/chapter-schmea";
import { Course } from "@/app/Models/course-sechema";
import { Purchase } from "@/app/Models/purchase-schema";
import { UserProgress } from "@/app/Models/userprogress-schema";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// type ProgressProps = {
//   userId: string | null;
//   courseId: string;
// };

// async function getProgress({ userId, courseId }: ProgressProps) {
//   try {
//     const publishedChapters = await Chapter.find({
//       courseId,
//       isPublished: true,
//     }).select("_id");

//     const publishedChapterIds = publishedChapters.map(
//       (chapter) => chapter._id
//     );

//     const validCompletedChapters = await UserProgress.countDocuments({
//       userId,
//       chapterId: { $in: publishedChapterIds },
//       isCompleted: true,
//     });

//     const progressPercentage =
//       (validCompletedChapters / publishedChapterIds.length) * 100;
//     return progressPercentage;
//   } catch (error) {
//     console.error("Error calculating progress:", error);
//     return null;
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const { userId } = auth();
//     const { title, categoryId } = await req.json();
//     if(!userId) return new NextResponse("Unauthorized!!", {status:400})
//     await dbConnect();

//     const courses = await Course.find({
//       isPublished: true,
//       title: { $regex: title, $options: "i" },
//       categoryId,
//     }).sort({ createdAt: -1 });

//     const courseIds = courses.map((course) => course._id);

//     const chapters = await Chapter.find({
//       courseId: { $in: courseIds },
//       isPublished: true,
//     })
//       .select("_id courseId")
//       .sort({ createdAt: -1 });

//     const purchases = await Purchase.find({
//       courseId: { $in: courseIds },
//       userId,
//     }).sort({ createdAt: -1 });

//     const courseWithProgress = await Promise.all(
//       courses.map(async (course) => {
//         const purchaseOfCourse = purchases.filter(
//           (purchase) => purchase.courseId === course._id
//         );
//         const chapterOfCourse = chapters.filter(
//           (chapter) => chapter.courseId.toString() === course._id.toString()
//         );
//         const courseId = course._id.toString();
//         const progressPercentage =
//           purchaseOfCourse.length > 0 ? await getProgress({ userId, courseId }) : null;

//         return {
//           ...course.toObject(),
//           category: null, // Assuming category will be populated elsewhere
//           chapters: chapterOfCourse.map((chapter) => ({ _id: chapter._id })),
//           progress: progressPercentage,
//         };
//       })
//     );

//     return new Response(JSON.stringify(courseWithProgress), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error fetching courses with progress:", error);
//     return new Response(
//       JSON.stringify({ error: "Failed to fetch courses" }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { title, categoryId } = await req.json();
    console.log(title, categoryId, req.json);

    const matchedCourse = await Course.find({
      userId,
      isPublished: true,
      title: {
        $regex: title || "", // Use $regex to perform a "contains" search
        $options: "i", // Makes the search case-insensitive
      },
      ...(categoryId && { categoryId }), // Only include categoryId if it's defined
    })
    .populate('categoryId', 'name _id')   
    
    console.log(matchedCourse);
    if (!matchedCourse)
      return new NextResponse("Something went worng!!!", { status: 500 });

    return NextResponse.json(matchedCourse);
  } catch (error) {
    console.log(error);
    return new NextResponse("COURSE ERROR" + error, { status: 500 });
  }
}
