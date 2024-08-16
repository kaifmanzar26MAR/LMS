
import { Course } from "@/app/Models/course-sechema";
import { getProgress } from "./get-progress";
import { Purchase } from "@/app/Models/purchase-schema";
import { Chapter } from "@/app/Models/chapter-schmea";
import dbConnect from "@/lib/dbConnect";

type CategoryProps = {
  _id: string;
  name: string;
};

interface AttachmentProps {
  _id: string;
  name: string;
  courseId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChapterProps {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  courseId:string;
}

type CourseProps = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryId: string;
  isPublished: boolean;
  attachments: AttachmentProps[];
  chapters?: ChapterProps[];
  createdAt: Date;
  updatedAt: Date;
};

type CourseWithProgressWithCategory = CourseProps & {
  category: CategoryProps | null;
  chapters: { _id: string }[];
  progress: number | null;
};

type GetCoursesProps = {
  userId: string;
  title: string;
  categoryId: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCoursesProps): Promise<CourseWithProgressWithCategory[]> => {
  try {
    await dbConnect();
    const courses = await Course.find({
      isPublished: true,
      title: { $regex: title, $options: "i" }, 
      categoryId,
    }).sort({ createdAt: -1 });

    const courseIds = courses.map((course:CourseProps ) => course._id);

    const chapters = await Chapter.find({
      courseId: { $in: courseIds },
      isPublished: true,
    })
      .select("_id")
      .sort({ createdAt: -1 });

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      userId,
    }).sort({ createdAt: -1 });

    const courseWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      courses.map(async (course:CourseProps) => {
        const purchaseOfCourse = purchases.filter(purchase => purchase.courseId === course._id);
        const chapterOfCourse = chapters.filter((chapter:ChapterProps) => chapter.courseId === course._id);
        const progressPercentage = purchaseOfCourse.length > 0 ? await getProgress(userId, course._id) : null;
        
        return {
          ...Object(course),
          category: null, // Assuming category will be populated elsewhere
          chapters: chapterOfCourse.map((chapter:ChapterProps) => ({ _id: chapter._id })),
          progress: progressPercentage,
        };
      })
    );

    return courseWithProgress;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new Error("Failed to fetch courses");
  }
};
