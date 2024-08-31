import { CourseProgress } from "@/components/course-progress";
import { IconBadge } from "@/components/icon-badge";
import { formatPrice } from "@/lib/format-price";
import axios from "axios";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CourseCardProps {
  _id: string;
  title: string;
  imageUrl: string;
  chapterIds: string[];
  price: number;
  progress: number;
  category: string;
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
const CourseCard = ({
  _id,
  title,
  imageUrl,
  chapterIds,
  price,
  category,
}: CourseCardProps) => {
  const [chapters, setChapters] = useState([]);
  const [progressPercent, setProgressPercent]=useState(0);
  
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await axios.post("/api/get_chapters", {
          ids: chapterIds,
        });
        setChapters(response.data);
        console.log(response.data);

        const completedChapters= response.data.filter((chapter:ChapterProps)=>{
          if(chapter.isCompleted===true){
            return chapter;
          }
        });
        setProgressPercent(Math.round((completedChapters.length/response.data.length)*100))
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    if (chapterIds.length > 0) {
      fetchChapters();
    }
  }, [chapterIds]);
  return (
    <Link href={`/courses/${_id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <img
            width="fill"
            className="object-cover"
            alt={title}
            src={imageUrl}
          />
        </div>
        <div className="flex md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
          {title}
        </div>
        <p className="text-sx text-muted-foreground">{category}</p>
        <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
          <div className="flex items-center gap-x-1 text-slate-500">
            <IconBadge size="sm" icon={BookOpen} />
            <span>
              {chapters.length} {chapters.length === 1 ? "Chapter" : "Chapters"}
            </span>
          </div>
        </div>
        {
            progressPercent!==null ? (
                <CourseProgress size="sm" value={progressPercent} variant={progressPercent ===100 ? "success" : "default"}/>
            ):(
                <p className="text-md md:text-sm font-medium text-slate-700">
                    {formatPrice(price)}
                </p>
            )
        }

      </div>

    </Link>
  );
};

export default CourseCard;
