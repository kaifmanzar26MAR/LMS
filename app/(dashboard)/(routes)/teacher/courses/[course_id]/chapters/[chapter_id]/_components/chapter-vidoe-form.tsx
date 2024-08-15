"use client";

import * as z from "zod";
import axios from "axios";
import {  Pencil, PlusCircle, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { FileUpload } from "@/components/file-upload";
import MuxPlayer from '@mux/mux-player-react';

const formSchema = z.object({
  videoUrl: z.string().min(1, {
    message: "vidoeUrl is required",
  }),
});

interface ChapterData {
  _id: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  isFree?: boolean;
  isPublished?: boolean;
  muxData?:string
}

interface MuxDataProps{
  chapterId:string;
  assetId:string;
  playbackId:string;
}

interface ChapterVideoFormProps {
  initialData: ChapterData
  courseId: string;
  chapterId:string;
  load:()=>void;
}
export const ChapterVideoForm = ({ initialData, courseId, chapterId, load }: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [muxData, setMuxData]=useState<MuxDataProps | null>(null);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/update_course/${courseId}/${chapterId}/update_chapter`, values);
      toast.success("Chapter updated");
      load();
      fetchMuxData();
    } catch (error) {
      toast.error("Something went wrong")
    }
  };
  const toggleEdit=()=>{
    setIsEditing(!isEditing);
  }
  const fetchMuxData=async()=>{
    try {
      const response= await axios.post(`/api/getmuxdata`,{chapterId, _id:initialData.muxData});
      setMuxData(response.data[0]);
      console.log(response.data[0])
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    fetchMuxData();
  },[])
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
      <Button variant="ghost" onClick={toggleEdit}>
        {isEditing && <>Cancel</>}
        {
          !isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2"/>
              Add an Video
            </>
          )
        }
        {!isEditing && initialData.videoUrl && (
          <>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Video
          </>
        )}
      </Button>
      </div>
      {
        !isEditing && (
             !initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500"/>
          </div>
        ): (
          <div className="relative aspect-video mt-2">
            {
              muxData?.playbackId ? <MuxPlayer playbackId={muxData?.playbackId || ""}/> : <video src={initialData.videoUrl} controls/> 
            }
            {/* <MuxPlayer playbackId={muxData?.playbackId || ""}/> */} {/*Not working mux */}
            
          </div>
        ))
      }
      {
        isEditing && (
            <div>
              <FileUpload 
                endpoint="courseVideo"
                onChange={(url)=>{
                  if(url){
                    onSubmit({videoUrl:url});
                  }
                }}
              />
              <div className="text-xs text-muted-foreground mt-4">
                Uplaod this chapter&apos;s video
              </div>
            </div>
        )
      }
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if video does not appear.
        </div>
      )}
    </div>
  );
};
