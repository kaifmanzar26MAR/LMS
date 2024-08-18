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
  }
  
interface CourseSidebarProps{
    course:CourseDataProps | null;
    chapters:ChapterProps[] | [];
    progresses:{
      isCompleted:boolean;
      _id:string;
    }[];
    isPurchased:boolean;
}
const CourseSidebar = ({course, chapters, progresses, isPurchased}:CourseSidebarProps) => {
  if(!course){
    return <></>
  }
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
      <h1 className="font-semibold">
        {course?.title}
      </h1>
      {/* Check purchase and add progress */}
      </div>
      <div className="flex flex-col w-full">
        {chapters?.map((chapter:ChapterProps)=>{
          const isCompleted= progresses.find((progress)=> progress.isCompleted===true)
          console.log("iscomp", isCompleted, progresses)
          return(
            <CourseSidebarItems
              key={chapter._id}
              _id={chapter._id}
              label={chapter.title}
              isCompleted={!!isCompleted}
              isLocked={!chapter.isFree && !isPurchased}
              courseId={course?._id} 
            />
          )
        })
        }
      </div>
    </div>
  )
}

export default CourseSidebar