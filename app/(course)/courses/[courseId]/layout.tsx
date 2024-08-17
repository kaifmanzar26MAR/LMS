"use client"

import { useEffect, useState } from "react";
import CourseSidebar from "./_components/course-sidebar";
import axios from "axios";
interface CourseDataProps {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    categoryId: { _id:string, name:string};
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
    courseId:string;
  }
const CourseLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
    const [course, setCourse]=useState<CourseDataProps | null>(null);
    const [progress, setProgress]=useState(0);
    const [chapters, setChapters]=useState<ChapterProps[] | []>([]);


    const fetchCourseData=async ()=>{
        try {
            const courseResponse= await axios.post('/api/get_a_course', {_id:params.courseId})
            setCourse(courseResponse.data);
            const chapterResponse = await axios.post("/api/get_chapters", {
                ids: courseResponse.data?.chapters,
              });
            setChapters(chapterResponse.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchCourseData();
    },[params.courseId])

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course}  chapters={chapters} progress={progress}/>
      </div>
      <main className="md:pl-80 h-full">{children}</main>
    </div>
  );
};
export default CourseLayout;
