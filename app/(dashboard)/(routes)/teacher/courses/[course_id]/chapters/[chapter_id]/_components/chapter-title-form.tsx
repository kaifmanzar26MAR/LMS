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
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1),
});
interface CourseData {
  _id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  categoryId?: string;
}

interface ChapterTitleFormProps {
  initialData: CourseData;
  courseId: string;
  chapterId:string;
  load:()=>void;
}
export const ChapterTitleForm = ({ initialData, courseId, chapterId, load }: ChapterTitleFormProps) => {
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
        Chapter title
      <Button variant="ghost" onClick={toggleEdit}>
        {isEditing && <>Cancel</>}
        {!isEditing && (
          <>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Title
          </>
        )}
      </Button>
      </div>
      {
        !isEditing && (
            <p className="text-sm mt-2">{initialData?.title}</p>
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
                        name="title"
                        render={({field})=>(
                            <FormItem>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        placeholder="e.g. 'Intorduction to the course'"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
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
