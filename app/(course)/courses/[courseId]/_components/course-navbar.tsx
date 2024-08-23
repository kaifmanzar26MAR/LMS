"use client"
import NavbarRoutes from '@/components/navbar-routes';
import React from 'react'
import CourseMobileSidebar from './course-mobile-sidebar';

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
  interface CourseNavbarProps{
    course:CourseDataProps | null;
    chapters:ChapterProps[] | [];
    progresses:{
      isCompleted:boolean;
      _id:string;
    }[];
    isPurchased:boolean;
    progressPercent:number;

  }
const CourseNavbar = ({course, progresses,chapters, isPurchased, progressPercent }: CourseNavbarProps) => {
  return (
    <div className='p-4 border-b h-full flex items-center bg-white shadow-sm'>
        <CourseMobileSidebar course={course} progresses={progresses} chapters={chapters} isPurchased={isPurchased} progressPercent={progressPercent} />
        <NavbarRoutes/>
    </div>
  )
}

export default CourseNavbar