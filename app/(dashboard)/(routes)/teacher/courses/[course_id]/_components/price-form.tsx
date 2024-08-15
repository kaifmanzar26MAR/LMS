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
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/format-price";

const formSchema = z.object({
  price : z.coerce.number(),
});

interface CourseData {
    _id: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    price?: number;
    categoryId?: string;
  }
  

interface PriceFormProps {
  initialData: CourseData;
  courseId: string;
  load:()=>void;
}
export const PriceForm = ({ initialData, courseId, load }: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || undefined,
    }
  });

  const { isSubmitting, isValid } = form.formState;
  const router= useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/update_course/${courseId}`, values);
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
        Course Price
      <Button variant="ghost" onClick={toggleEdit}>
        {isEditing && <>Cancel</>}
        {!isEditing && (
          <>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Price
          </>
        )}
      </Button>
      </div>
      {
        !isEditing && (
            <p className={cn("text-sm mt-2", !initialData.price && "text-slate-500 italic")}>{initialData?.price ? formatPrice(initialData?.price) : "No Price"}</p>
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
                        name="price"
                        render={({field})=>(
                            <FormItem>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        step="0.01"
                                        placeholder="Set a price for your course!'"
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
