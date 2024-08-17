"use client";

import CourseCard from "@/app/(dashboard)/(routes)/search/_components/course-card";

interface AttachmentProps {
  _id: string;
  name: string;
  courseId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}


interface CourseDataProps {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryId: { _id:string, name:string};
  isPublished: boolean;
  attachments: AttachmentProps[];
  chapters?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface CourseListProps {
  courses: CourseDataProps[];
}
export const CourseList = ({ courses }: CourseListProps) => {
  return (
    <div className="transition">
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {courses?.map((course: CourseDataProps) => {
          return <CourseCard key={course._id} _id={course._id} title={course.title} imageUrl={course.imageUrl} chapterIds={course?.chapters || []} price={course.price || 0} progress={0} category={course.categoryId.name}/>;
        })}
      </div>

      {courses.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No Couses Found
        </div>
      )}
    </div>
  );
};
