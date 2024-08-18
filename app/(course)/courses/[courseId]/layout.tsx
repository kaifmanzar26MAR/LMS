"use client";

import { useEffect, useState } from "react";
import CourseSidebar from "./_components/course-sidebar";
import axios from "axios";
import CourseNavbar from "./_components/course-navbar";
interface CourseDataProps {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryId: { _id: string; name: string };
  isPublished: boolean;
  attachments?: string[];
  chapters?: string[];
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
  courseId: string;
}
const CourseLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const [course, setCourse] = useState<CourseDataProps | null>(null);
  const [progresses, setProgresses] = useState([]);
  const [chapters, setChapters] = useState<ChapterProps[] | []>([]);
  const [isPurchased, setIsPurchased] = useState(false);

  const fetchCourseData = async () => {
    try {
      const courseResponse = await axios.post("/api/get_a_course", {
        _id: params.courseId,
      });
      setCourse(courseResponse.data);
      const chapterResponse = await axios.post("/api/get_chapters", {
        ids: courseResponse.data?.chapters,
      });
      setChapters(chapterResponse.data);
      const chapterProgress = await axios.post(
        "/api/get_purchase_and_progress",
        {
          courseId: courseResponse.data?._id,
          chapters: courseResponse.data?.courses,
        }
      );
      console.log("progresses", chapterProgress.data);
      setProgresses(chapterProgress.data?.progresses || []);
      setIsPurchased(chapterProgress.data?.isPurchase || false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [params.courseId]);

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar course={course}
          chapters={chapters}
          progresses={progresses}
          isPurchased={isPurchased}/>
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar
          course={course}
          chapters={chapters}
          progresses={progresses}
          isPurchased={isPurchased}
        />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};
export default CourseLayout;
