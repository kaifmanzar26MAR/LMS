"use client"

import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from '@hello-pangea/dnd'

import { cn } from "@/lib/utils";
import {Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChapterProps{
    _id:string;
    title:string;
    description:string;
    videoUrl:string;
    position:number;
    isPublished:boolean;
    isFree:boolean;
  }
interface ChapterListProps{
    items:ChapterProps[];
    onReorder: (updateData: {_id:string; position:number}[])=>void;
    onEdit:(id:string)=>void;
};

export const ChapterList=({
    items,
    onReorder,
    onEdit
}:ChapterListProps)=>{

    const [isMounted, setIsMounted]=useState(false);
    const [chapters, setChapters]=useState(items);

    

    const onDragEnd=(result:DropResult)=>{
        if(!result.destination){
            return;
        }
        const items=Array.from(chapters);

        const [reorderedItems]=items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItems)

        const startIndex= Math.min(result.source.index, result.destination.index);
        const endIndex= Math.max(result.source.index, result.destination.index);

        const upadatedChapters= items.slice(startIndex, endIndex +1);

        setChapters(items);

        const bulkUpdateData= upadatedChapters.map((chapter)=>({
            _id:chapter._id,
            position: items.findIndex((item)=>item._id === chapter._id)
        }));

        onReorder(bulkUpdateData);
    }

    useEffect(()=>{
        setIsMounted(true);
    },[])
    useEffect(()=>{
        setChapters(items);
        console.log(items)
    },[items])

    if(!isMounted){
        return null;
    }

    return(
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
                {(provided)=>(
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {
                            chapters?.map((chapter, index)=>(
                                <Draggable key={chapter._id} draggableId={chapter._id} index={index}>
                                    {(provided)=>(
                                        <div className={cn(
                                            "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm", chapter?.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
                                        )} ref={provided.innerRef} {...provided.draggableProps}>
                                            <div className={cn(
                                                "flex items-center justify-evenly gap-x-2 w-full px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition", chapter.isPublished && "border-r-sky-200 hover:bg-sky-200"
                                            )} {...provided.dragHandleProps}>
                                                <Grip className="h-5 w-5"/>
                                                {chapter.title}
                                                <div className="ml-auto pr-2 flex items-center gap-x-2">
                                                    {
                                                        chapter.isFree && (
                                                            <Badge>
                                                                Free
                                                            </Badge>
                                                        )
                                                    }
                                                    <Badge className={cn(
                                                        "bg-slate-500", chapter.isPublished && "bg-sky-700"
                                                    )}>
                                                        {chapter.isPublished ? "Published" : "Draft"}
                                                    </Badge>
                                                    <Pencil onClick={()=>onEdit(chapter._id)} className="w-4 h-4 cursor-pointer hover:opacity-75 transition"/>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))
                        }
                        {
                            provided.placeholder
                        }
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}