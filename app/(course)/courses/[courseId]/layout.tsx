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
  isCompleted:boolean;
}
interface ProgressDataProps {
  isPurchase: boolean;
  progresses: {
    isCompleted: boolean;
    _id: string;
  }[];
}
const CourseLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const [course, setCourse] = useState<CourseDataProps | null>(null);
  const [chapters, setChapters] = useState<ChapterProps[] | []>([]);
  const [progressData, setProgressData] = useState<ProgressDataProps | null>(
    null
  );
  const [progressPercent, setProgressPercent] = useState(0);

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
      
      const completedChapters= chapterResponse.data.filter((chapter:ChapterProps)=>{
        if(chapter.isCompleted===true){
          return chapter;
        }
      });
      setProgressPercent(Math.round((completedChapters.length/chapterResponse.data.length)*100))

    } catch (error) {
      console.log(error);
    }
  };

  const fetchProgressAndPurchase = async () => {
    try {
      if (
        !course ||
        !course._id ||
        !course.chapters ||
        course.chapters.length === 0
      ) {
        return;
      }
      const chapterProgress = await axios.post(
        "/api/get_purchase_and_progress",
        {
          courseId: course._id,
          chapters: course.chapters,
        }
      );
      setProgressData(chapterProgress.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchCourseData();
  }, [params.courseId]);

  useEffect(() => {
    if (!course?.chapters) {
      return;
    }
    fetchProgressAndPurchase();
    console.log("all progress", progressData);
  }, [course, setCourse]);

  if (!progressData) {
    console.log("pd",progressData);
    return <> NULL</>;
  }

  console.log("direct not null ", progressData);

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar
          course={course}
          chapters={chapters}
          progresses={progressData.progresses}
          progressPercent= {progressPercent}
          isPurchased={progressData.isPurchase}
        />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar
          course={course}
          chapters={chapters}
          progresses={progressData.progresses}
          progressPercent={progressPercent}
          isPurchased={progressData.isPurchase}
        />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};
export default CourseLayout;
