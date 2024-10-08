"use client"

import { IconBadge } from "@/components/icon-badge";
import axios from "axios";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chpater-access-settings";
import { ChapterVideoForm } from "./_components/chapter-vidoe-form";
import { Banner } from "@/components/banner";
import { ChapterActions } from "./_components/cahpter-action";

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
   

    const [chapterData, setChapterData]=useState<ChapterProps | null>(null);
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

    if(!chapterData){
        return <>Loading...</>
    }

    const requiredFields=[
        chapterData.title,
        chapterData.description,
        chapterData.videoUrl
    ];

    const totalFields= requiredFields.length;
    const completerdFields= requiredFields.filter(Boolean).length;

    const complettionText= `(${completerdFields}/${totalFields})`;



    const isComplete= requiredFields.every(Boolean);
    return(
        <>
        
            {
            !chapterData.isPublished && (
                <Banner
                variant="warning"
                label="This chapter is unpublished. It will not be visible in the course."/>
            )
            }
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link  href={`/teacher/courses/${params.course_id}`} className="flex items-center text-sm hover:opacity-75 transition mb-6">
                        <ArrowLeft className="h-4 w-4 mr-2"/>
                        Back To Course Setup
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Chapter Creation
                            </h1>
                            <span className="text-sm text-slate-700">
                                Complete all fields {complettionText}
                            </span>
                        </div>
                        <ChapterActions
                            disabled={!isComplete}
                            courseId={params.course_id}
                            chapterId={params.chapter_id}
                            isPublished={chapterData.isPublished}
                            load={fetchChapterData}
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard}/>
                            <h2 className="text-xl">
                                Customize your chapter
                            </h2>
                        </div>
                        <ChapterTitleForm 
                        initialData={chapterData}
                        chapterId={chapterData._id}
                        courseId={params.course_id}
                        load={fetchChapterData}
                        />
                        <ChapterDescriptionForm
                            initialData={chapterData}
                            chapterId={chapterData._id}
                            courseId={params.course_id}
                            load={fetchChapterData}
                            />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Eye}/>
                            <h2 className="text-xl">
                                Access Settings
                            </h2>
                        </div>
                    </div>
                    <ChapterAccessForm
                        initialData={chapterData}
                        courseId={params.course_id}
                        chapterId={params.chapter_id}
                        load={fetchChapterData}
                        />
                </div>
                <div >
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={Video}/>
                        <h2 className="text-xl">
                            Add a video
                        </h2>
                    </div>
                    
                    <ChapterVideoForm
                    initialData={chapterData}
                    courseId={params.course_id}
                    chapterId={params.chapter_id}
                    load={fetchChapterData}
                    />
                </div>
                

            </div>
        </div>
        </>
    )
}

export default ChapterDetails;