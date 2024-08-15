"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps{
    disabled:boolean;
    courseId:string;
    chapterId:string;
    isPublished:boolean;
    load:()=>void;
}
export const ChapterActions=({disabled, courseId, chapterId, isPublished, load}:ChapterActionsProps)=>{
    
    const [isLoading, setIsLoading]=useState(false);
    const router= useRouter();

    const onDelete= async()=>{
        try {
            setIsLoading(true);
            // console.log("deleted")
            await axios.delete(`/api/update_course/${courseId}/${chapterId}/delete_chapter`);
            toast.success("Chapter Deleted");
            router.push(`/teacher/courses/${courseId}`)
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
            await axios.post(`/api/update_course/${courseId}/${chapterId}/update_chapter`, {isPublished: !isPublished })
            toast.success(!isPublished ? "Chapter Published" : "Chpater UnPublished")
            load();

        } catch (error) {
            toast.error("Something went wrong!!")
            
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