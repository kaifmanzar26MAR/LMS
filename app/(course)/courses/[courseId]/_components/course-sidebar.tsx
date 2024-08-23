import { CourseProgress } from "@/components/course-progress";
import CourseSidebarItems from "./course-sidebar-items";

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
    isCompleted?:boolean;
  }
  
interface CourseSidebarProps{
    course:CourseDataProps | null;
    chapters?:ChapterProps[] | [];
    progresses:{
      isCompleted:boolean;
      _id:string;
    }[];
    isPurchased:boolean;
    progressPercent:number;
}
const CourseSidebar = ({course, chapters, progresses, isPurchased, progressPercent}:CourseSidebarProps) => {
  if(!course){
    return <>Loading...</>
  }
  console.log("hiii", isPurchased, progresses)
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
      <h1 className="font-semibold">
        {course?.title}
      </h1>
      {
        isPurchased && (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressPercent}/>
          </div>
        )
      }
      </div>
      <div className="flex flex-col w-full">
        {chapters?.map((chapter:ChapterProps)=>{
          const isCompleted= progresses[chapter.position]
          console.log("iscomp", isCompleted, progresses)
          console.log("purchase", isPurchased)
          return(
            <CourseSidebarItems
              key={chapter._id}
              _id={chapter._id}
              label={chapter.title}
              isCompleted={chapter.isCompleted ? chapter.isCompleted : false}
              isLocked={!chapter.isFree && !isPurchased}
              courseId={course?._id} 
              isPurchased={isPurchased}
            />
          )
        })
        }
      </div>
    </div>
  )
}

export default CourseSidebar