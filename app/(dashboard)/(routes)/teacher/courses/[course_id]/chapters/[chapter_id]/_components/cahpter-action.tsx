"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps{
    disabled:boolean;
    courseId:string;
    chapterId:string;
    isPublished:boolean;
}
export const ChapterActions=({disabled, courseId, chapterId, isPublished}:ChapterActionsProps)=>{
    
    const [isLoading, setIsLoading]=useState(false);

    const onDelete= async()=>{
        try {
            setIsLoading(true);
            console.log("deleted")
            // await axios.delete(`/api/courses/${courseId}/${chapterId}/delte_chapter`);
            toast.success("Chapter Deleted");
        } catch (error) {
            toast.error("Something went worng!!");
        }finally{
            setIsLoading(false)
        }
    }
    const onPublish=async()=>{
        try {
            setIsLoading(true);
            console.log("published")
            toast.success("Chapter Published")
            // await axios.post(`/api/course/${courseId}/${chapterId}/update_course`, {isPublished:true})
        } catch (error) {
            toast.error("Something went wrong!!")
            
        }
    }
    return (
        <div className="flex items-center gap-x-2">
            <ConfirmModal onConfirm={onPublish}>
                <Button 
                    disabled={disabled}
                    variant="outline"
                    size="sm"
                >
                    {isPublished ? "Unpublish" : "Publish"}
                </Button>
                </ConfirmModal>
            
            <ConfirmModal onConfirm={onDelete}>
                <Button>
                    <Trash className="h-4 w-4"/>
                </Button>
            </ConfirmModal>
        </div>
    )
}