"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ChapterProps{
    _id:string,
    title:string,
    description:string,
    videoUrl:string,
    position:number,
    isPublished:boolean,
    isFree:boolean,
  }

const ChapterDetails=({params}:{params:{chapter_id:string, course_id:string}})=>{

    const router= useRouter();
   

    const [cahpterData, setChapterData]=useState<ChapterProps | null>(null);
    const fetchChapterData=async()=>{
        try {
            const response= await axios.get(`/api/getchapters/${params.course_id}/get_a_chapter/${params.chapter_id}`);
            if(!response){
                throw new Error("Error in finding Chapter details!!");
            }
            console.log(response.data);
            setChapterData(response.data);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(()=>{
        fetchChapterData();
    },[params.chapter_id])
    return(
        <div>
            Chapter Details
        </div>
    )
}

export default ChapterDetails;