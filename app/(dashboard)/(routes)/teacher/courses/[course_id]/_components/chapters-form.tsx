"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChapterList } from "./chapter-list";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});


interface ChapterProps{
  _id:string;
  title:string;
  description:string;
  videoUrl:string;
  position:number;
  isPublished:boolean;
  isFree:boolean;
}

interface CourseDataProps {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryId: string;
  chapters?:ChapterProps[];
  createdAt:Date;
  updatedAt:Date;
}

interface ChapterFormProps {
  initialData: CourseDataProps;
  courseId: string;
}
export const ChapterForm = ({ initialData, courseId }: ChapterFormProps) => {
  const [isCreating, setIsCreating]=useState(false);
  const [isUpdating, setIsUpdating]=useState(false);
  const [chapters, setChapters]= useState<ChapterProps[] | []>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;
  const router= useRouter();

  const onReorder = async (updateData:{_id: string, position:number}[])=>{
      try {
        setIsUpdating(true);
        await axios.put(`/api/update_course/${courseId}/reorder`,{
          list:updateData
        });
        toast.success("Chapters reordered!")
        router.refresh();
      } catch (error) {
        toast.error("Something went wrong");
      }finally{
        setIsUpdating(false);
      }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    try {
      await axios.post(`/api/update_course/${courseId}/add_chapter`, values);
      toast.success("chapter created");
      window.location.reload();
    } catch (error) {
      toast.error("Something went wrong")
    }
  };
  const toggleCreating=()=>{
    setIsCreating(!isCreating);
  }
  const fetchChapters= async()=>{
    try {
      const response= await axios.get(`/api/getchapters/${courseId}`);
      console.log(response.data)
      setChapters(response.data);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    fetchChapters();
  },[])
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 relative">
      {
        isUpdating && (
          <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
            <Loader2 className="animate-spin h-6 w-6 text-sky-700"/>
          </div>
        )
      }
      <div className="font-medium flex items-center justify-between">
        Course Chapters
      <Button variant="ghost" onClick={toggleCreating}>
        {isCreating && <>Cancel</>}
        {!isCreating && (
          <>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add a Chapter
          </>
        )}
      </Button>
      </div>
      
      {
        isCreating && (
            <Form {...form}>
                <form 
                    onSubmit= {form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4"
                >
                    <FormField 
                        control={form.control}
                        name="title"
                        render={({field})=>(
                            <FormItem>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        placeholder="e.g. 'Introduction to the course ...'"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    
                    <Button disabled={!isValid || isSubmitting}>Create</Button>
                    
                </form>
            </Form>
        )
      }
      {
        !isCreating && (
          <div className={cn(
            "text-sm mt-2",
            initialData && !initialData?.chapters?.length && "text-slate-500 italic"
          )}>
            {!initialData?.chapters?.length && "No Chapters" }
            {initialData.chapters?.length && 
              <ChapterList onEdit={()=>{}} onReorder={onReorder} items={chapters || []}/>
            }
          </div>
        )
      }
      {
        !isCreating && (
          <p className="text-xs text-muted-foreground mt-4">
            Drag and drop to reorder the chapters
          </p>
        )
      }
    </div>
  );
};
