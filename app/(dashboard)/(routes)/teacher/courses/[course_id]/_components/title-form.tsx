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

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

interface TitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
}
export const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  const toggleEdit=()=>{
    setIsEditing(!isEditing);
  }
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course title
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
            <p>{initialData?.title}</p>
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
                                        placeholder="e.g. 'Advaced web development'"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        )
      }
    </div>
  );
};
