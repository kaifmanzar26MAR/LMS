
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
  
interface CourseSidebarProps{
    course:CourseDataProps | null;
    chapters:ChapterProps[] | [];
    progress:number;
}
const CourseSidebar = ({course, chapters, progress}:CourseSidebarProps) => {
  return (
    <div>{course?.title} {chapters[0].title} {progress}</div>
  )
}

export default CourseSidebar