"use client";

import { Banner } from "@/components/banner";
import axios from "axios";
import { useEffect, useState } from "react";
import ChapterVideoPlayer from "./_components/chapter-video-player";
import CourseEnrollButton from "./_components/course-enrollment-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import CourseProgressButton from "./_components/course-progress-button";

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
interface ProgressProps {
  isCompleted: boolean;
  _id: string;
}
interface MuxDataProps {
  _id: string;
  chapterId: string;
  assetId: string;
  playbackId: string;
}
interface AttachmentProps {
  _id: string;
  url: string;
  name: string;
}
interface CourseDataProps {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryId: { _id: string; name: string };
  isPublished: boolean;
  attachments?: string[];
  chapters?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProgressDataProps {
  isPurchase: boolean;
  progresses: {
    isCompleted: boolean;
    _id: string;
  }[];
}

const ChapterIdPage = ({
  params,
}: {
  params: { chapterId: string; courseId: string };
}) => {
  const [chapterData, setChapterData] = useState<ChapterProps | null>(null);
  const [progress, setProgress] = useState<ProgressProps>({isCompleted:false, _id:""});
  const [isPurchased, setIsPurchased] = useState(false);
  const [muxData, setMuxData] = useState<MuxDataProps | null>(null);
  const [attachments, setAttachments] = useState<AttachmentProps[]>([]);
  const [course, setCourse] = useState<CourseDataProps | null>(null);
  const [progressData, setProgressData] = useState<ProgressDataProps | null>(
    null
  );

  const fetchChapterData = async () => {
    try {
      const response = await axios.get(
        `/api/getchapters/${params.courseId}/get_a_chapter/${params.chapterId}`
      );
      setChapterData(response.data);

      const courseResponse = await axios.post("/api/get_a_course", {
        _id: params.courseId,
      });
      setCourse(courseResponse.data);

      const muxResponse = await axios.post("/api/getmuxdata", {
        _id: response.data?.muxdata,
        chapterId: params.chapterId,
      });
      setMuxData(muxResponse.data[0]);

      const attachmentResponse = await axios.get(
        `/api/get_attachments/${params.courseId}`
      );
      setAttachments(attachmentResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProgressAndPurchase = async () => {
    try {
      if (!course || !course._id || !chapterData) {
        return;
      }

      const chapterProgress = await axios.post(
        "/api/get_purchase_and_progress",
        {
          courseId: course._id,
          chapters: course.chapters,
        }
      );
      setProgressData(chapterProgress.data);
      setIsPurchased(chapterProgress.data.isPurchase);
      setProgress(chapterProgress.data?.progresses[chapterData.position]);
      console.log("prog data", chapterProgress.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChapterData();
  }, [params.chapterId, params.courseId]);

  useEffect(() => {
    if (course && chapterData) {
      fetchProgressAndPurchase();
    }
  }, [course, chapterData]);

  if (!chapterData) return <>Loading...</>;

  const isLocked = !chapterData.isFree && !progressData?.isPurchase;
  const completedOnEnd =
    progressData?.isPurchase && progress ? progress.isCompleted : false;

  return (
    <div>
      {chapterData?.isCompleted && (
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
            playbackId={muxData?.playbackId || null}
            isLocked={isLocked}
            completedOnEnd={completedOnEnd}
            videoUrl={chapterData.videoUrl}
          />
        </div>
        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-2xl font-semibold mb-2">{chapterData.title}</h2>
          {isPurchased ? (
            <div>
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={
                  course?.chapters
                    ? course.chapters.length >= chapterData?.position + 1
                      ? course?.chapters[chapterData.position + 1]
                      : null
                    : null
                }
                isCompleted={chapterData.isCompleted}
              />
            </div>
          ) : (
            <CourseEnrollButton
              courseId={params.courseId}
              price={Number(course?.price)}
            />
          )}
        </div>
        <Separator />
        <div
          dangerouslySetInnerHTML={{ __html: chapterData.description }}
          className="p-6 bg-white"
        />
        {!!attachments.length && (
          <>
            <Separator />
            <div className="p-4">
              {attachments.map((attachment) => (
                <a
                  href={attachment.url}
                  target="_blank"
                  key={attachment._id}
                  className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                >
                  <File />
                  <p className="line-clamp-1">{attachment.name}</p>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChapterIdPage;
