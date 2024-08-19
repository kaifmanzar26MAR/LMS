"use client";

import { Banner } from "@/components/banner";
import axios from "axios";
import { useEffect, useState } from "react";
import ChapterVideoPlayer from "./_components/chapter-video-player";
import CourseEnrollButton from "./_components/course-enrollment-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";

interface ChapterProps {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  courseId: string;
}
interface progressProps {
  isCompleted: boolean;
  _id: string;
}
interface muxdataProps{
  _id:string;
  chapterId:string;
  assetId:string;
  playbackId:string;
}
interface AttachmentProps{
  _id:string;
  url:string;
  name:string;
}
 
const ChapterIdPage = ({
  params,
}: {
  params: { chapterId: string; courseId: string };
}) => {
  const [chapterData, setChapterData] = useState<ChapterProps | null>(null);
  const [progress, setProgress] = useState<progressProps | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [muxdata, setMuxData]=useState<muxdataProps | null>(null);
  const [coursePrice, setCoursePrice]=useState(0);
  const [attachments, setAttachments]=useState<AttachmentProps[] | []>([]);
  const fetchChpaterData = async () => {
    try {
      const response = await axios.get(
        `/api/getchapters/${params.courseId}/get_a_chapter/${params.chapterId}`
      );
      console.log(response.data);
      setChapterData(response.data);
      const courseResponse= await axios.post('/api/get_a_course',{_id:params.courseId})
      setCoursePrice(courseResponse.data.price);
      const chapterProgress = await axios.post(
        "/api/get_purchase_and_progress",
        {
          courseId: params.courseId,
          chapters:courseResponse.data?.chapters,
        }
      );
      console.log("progresss data", chapterProgress.data);
      const muxResponse= await axios.post("/api/getmuxdata", {_id:response.data?.muxdata, chapterId:params.chapterId})
      console.log("mux", muxResponse.data);
      setMuxData(muxResponse.data[0]);
      setIsPurchased(chapterProgress.data.isPurchase);
      setProgress(chapterProgress.data?.progresses[response.data?.position] || false);
      const attachmentResponse= await axios.get(`/api/get_attachments/${params.courseId}`);
      setAttachments(attachmentResponse.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchChpaterData();
  }, [params.chapterId, params.courseId]);

  if (!chapterData) {
    return <>Loading...</>;
  }

  const isLocked = !chapterData.isFree && !isPurchased;
  const completedOnEnd = !!isPurchased && (progress ? progress?.isCompleted : false);
  return (
    <div>
      {progress?.isCompleted && (
        <Banner
          variant="success"
          label="You have already completed this chapter"
        />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase the course to watch this chapter!"
        />
      )}

      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <ChapterVideoPlayer
            chapterId={params.chapterId}
            title={chapterData.title}
            courseId={params.courseId}
            // nextChapterId={nextChapter?._id}
            playbackId={muxdata?.playbackId || null}
            isLocked={isLocked}
            completedOnEnd={completedOnEnd}
            videoUrl={chapterData.videoUrl}
          />
        </div>
        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-2xl font-semibold mb-2">{chapterData.title}</h2>
          {
            isPurchased ? (
              <div>
                {/* TODO: add coourse progresss button */}
              </div>
            ) : (
              <CourseEnrollButton courseId={params.courseId} price={coursePrice}/>
            )
          }
        </div>
        <Separator/>
        <div dangerouslySetInnerHTML={{__html:chapterData.description}} className="p-6 bg-white"/>
        {
          !!attachments.length && (
            <>
              <Separator/>
              <div className="p-4">
                {
                  attachments.map((attachment)=>(
                    <a href={attachment.url} target="_blank" key={attachment._id} className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline">
                      <File />
                      <p className="line-clamp-1">{attachment?.name}</p>
                    </a>
                  ))
                }
              </div>
            </>
          )
        }
      </div>
    </div>
  );
};

export default ChapterIdPage;
