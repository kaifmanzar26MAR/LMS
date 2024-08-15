"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettistore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseActionsProps{
    disabled:boolean;
    courseId:string;
    isPublished:boolean;
    load:()=>void;
}
export const CourseAction=({disabled, courseId, isPublished, load}:CourseActionsProps)=>{
    
    const [isLoading, setIsLoading]=useState(false);
    const router= useRouter();
    const confetti= useConfettistore();

    const onDelete= async()=>{
        try {
            setIsLoading(true);
            // console.log("deleted")
            await axios.delete(`/api/delete_course/${courseId}`);
            toast.success("Course Deleted");
            router.push(`/teacher/courses`)
        } catch (error) {
            toast.error("Something went worng!!");
        }finally{
            setIsLoading(false)
        }
    }
    const onPublish=async()=>{
        try {
            setIsLoading(true);
            // console.log("published")
            await axios.patch(`/api/update_course/${courseId}`, {isPublished: !isPublished })
            toast.success(!isPublished ? "Course Published" : "Course UnPublished")
            if(!isPublished){
                confetti.onOpen();
            }
            load();
        } catch (error) {
            toast.error("Something went wrong!!")
            console.log(error)
            
        }finally{
            setIsLoading(false)
        }
    }
    return (
        <div className="flex items-center gap-x-2">
            <ConfirmModal onConfirm={onPublish}>
                <Button 
                    disabled={disabled || isLoading}
                    variant="outline"
                    size="sm"
                >
                    {isPublished ? "Unpublish" : "Publish"}
                </Button>
                </ConfirmModal>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4"/>
                </Button>
            </ConfirmModal>
        </div>
    )
}