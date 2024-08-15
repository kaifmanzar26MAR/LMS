"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

interface ChapterData {
    _id: string;
    title?: string;
    description?: string;
    videoUrl?: string;
    isFree?: boolean;
    isPublished?: boolean;
  }
  

interface ChapterAccessFormProps {
  initialData: ChapterData;
  courseId: string;
  chapterId: string;
  load:()=>void;
}
export const ChapterAccessForm = ({ initialData, courseId, chapterId , load}: ChapterAccessFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;
  const router= useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      
      await axios.post(`/api/update_course/${courseId}/${chapterId}/update_chapter`, values);
      toast.success("Course updated");
      load();
    } catch (error) {
      toast.error("Something went wrong")
    }
  };
  const toggleEdit=()=>{
    setIsEditing(!isEditing);
  }
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Accessiblity
      <Button variant="ghost" onClick={toggleEdit}>
        {isEditing && <>Cancel</>}
        {!isEditing && (
          <>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Chapter Accessiblity
          </>
        )}
      </Button>
      </div>
      {
        !isEditing && (
            <div className={cn("text-sm mt-2", !initialData.isFree && "text-slate-500 italic")}>
            {!initialData?.isFree && "This chapter is not free for everyone"}
            {initialData.isFree && (
              <>This Chapter is Free for everyone.</>
            )}
            </div>
        )
      }
      {
        isEditing && (
            <Form {...form}>
                <form 
                    onSubmit= {form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4"
                >
                    <FormField 
                        control={form.control}
                        name="isFree"
                        render={({field})=>(
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                                </FormControl>
                                <FormDescription>
                                  Check this box if you want to make this chapter free for preview
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center gap-x-2">
                        <Button disabled={!isValid || isSubmitting}>Save</Button>
                    </div>
                </form>
            </Form>
        )
      }
    </div>
  );
};
