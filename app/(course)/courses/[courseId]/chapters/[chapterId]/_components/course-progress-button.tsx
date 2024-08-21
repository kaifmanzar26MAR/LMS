"use client"

import { Button } from "@/components/ui/button";
import { useConfettistore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps{
    chapterId:string;
    courseId:string;
    nextChapterId?:string | null;
    isCompleted:boolean;

}
const CourseProgressButton = ({chapterId,
    courseId,
    nextChapterId,
    isCompleted}:CourseProgressButtonProps) => {
        const router= useRouter();
        const confetti= useConfettistore();
        const [isLoading, setIsLoading]=useState(false);

        const onClick=async ()=>{
            setIsLoading(true);
            try {
                const resposne= axios.post(`/api/update_course/${courseId}/${chapterId}/update_chapter`, {isCompleted: !isCompleted});
                console.log(resposne);
                toast.success(!isCompleted ? "Marked Completed" : "Marked InCompleted")
                window.location.reload();
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong!")
            }finally{
                setIsLoading(false);
            }
        }
  return (
    <Button
    type="button"
    variant={isCompleted ? "outline" :"success"}
    className="w-full md:w-auto"
    disabled={isLoading}
    onClick={onClick}
    >
        {isCompleted ? "Mark as Not completed" : "Mark as Complete"}
       
    </Button>
  )
}

export default CourseProgressButton