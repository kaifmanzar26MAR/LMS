"use client";

import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock } from "lucide-react";
import { useEffect, useState } from "react";

interface ChapterVideoPlayerProps {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapterId?: string;
  playbackId: string | null;
  isLocked: boolean;
  completedOnEnd: boolean;
  videoUrl: string;
}
const ChapterVideoPlayer = ({
  chapterId,
  title,
  courseId,
  //   nextChapterId,
  playbackId,
  isLocked,
  completedOnEnd,
  videoUrl,
}: ChapterVideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    if (playbackId === null) setIsReady(true);
  }, [playbackId]);
  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This Chapter is Lock</p>
        </div>
      )}
      {
      !isLocked &&
        (playbackId ? (
          <MuxPlayer
            title={title}
            className={cn(!isReady && "hidden")}
            onCanPlay={() => setIsReady(true)}
            onEnded={() => {}}
            autoPlay
            playbackId={playbackId}
          />
        ) : (
          <video
            src={videoUrl}
            className={cn(!isReady && "hidden")}
            controls
            autoPlay
            title={title}
          />
        ))
        }
    </div>
  );
};

export default ChapterVideoPlayer;
