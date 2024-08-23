"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import CourseSidebar from "./course-sidebar";


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
  interface CourseMobileSidebarProps{
    course:CourseDataProps | null;
    chapters:ChapterProps[] | [];
    progresses:{
      isCompleted:boolean;
      _id:string;
    }[];
    isPurchased:boolean;
    progressPercent:number;
  }
const CourseMobileSidebar = ({course, progresses, chapters, isPurchased, progressPercent}:CourseMobileSidebarProps) => {
  return (
    <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
            <Menu/>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-white w-72">
            <CourseSidebar course={course} progresses={progresses} chapters={chapters} isPurchased={isPurchased} progressPercent={progressPercent}/>
        </SheetContent>
    </Sheet>
  )
}

export default CourseMobileSidebar