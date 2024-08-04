"use client";

import * as z from "zod";
import axios from "axios";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  url: z.string().min(1, {
    message: "Attachment url is required!",
  }),
});
interface AttachmentData {
  _id: string;
  name:string;
  courseId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}
interface CourseDataProps {
  _id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  categoryId?: string;
  attachments?: AttachmentData[];
  createdAt:Date;
  updatedAt:Date;
}

interface AttachmentFormProps {
  initialData: CourseDataProps;
  courseId: string;
}

export const Attachment = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId]=useState<String | null>(null);
 
  const [attachments, setAttachments]=useState([]);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/update_course/${courseId}/add_attachment`, values);
      toast.success("Course updated");
      window.location.reload();
    } catch (error) {
      toast.error("Something went wrong")
    }
  };

  const toggleEdit=()=>{
    setIsEditing(!isEditing);
  }
  const fetchAttachments=async()=>{
    try {
      const response= await axios.get(`/api/update_course/${courseId}/get_attachments`);
      if(!response.data){
        throw new Error("No Data found");
      }
      console.log(response.data);
      setAttachments(response.data)
    } catch (error) {
      toast.error("error occured");
    }
  }

  const onDelete=async (id:string)=>{
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Attachment deleted");
      window.location.reload();
    } catch (error) {
      toast.error("Something went wrong in deletion");
    }finally{
      setDeletingId(null);
    }
  }
  useEffect(()=>{
    fetchAttachments();
  },[])
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Attachments
      <Button variant="ghost" onClick={toggleEdit}>
        {isEditing && <>Cancel</>}
        {
          !isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2"/>
              Add an file
            </>
          )
        }
        
      </Button>
      </div>
      {
        !isEditing && (
          <>
           {
            attachments.length === 0 &&(
              <p className="text-sm mt-2 text-slate-500 italic">
                No attachments yet
              </p>
            )
           }
           {
            attachments.length > 0 && (
              <div className="space-y-2">
                { 
                  attachments?.map((attachment : AttachmentData)=>(
                    <div key={attachment._id} className="flex items-center p-2 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md">
                      <File  className='h-4 w-4 mr-2 flex-shrink-0'/>
                      <p>
                        {attachment?.name}
                      </p>
                    {
                      deletingId === attachment._id && (
                        <div>
                          <Loader2 className="h-4 w-4 animate-spin"/>
                        </div>
                      )
                    }
                    {
                      deletingId !== attachment._id && (
                        <button onClick={()=>onDelete(attachment._id)}>
                          <X className="h-4 w-4"/>
                        </button>
                      )
                    }
                    </div>
                  ))
                }
              </div>
            )
           }
          </>
        )
      }
      {
        isEditing && (
            <div>
              <FileUpload 
                endpoint="courseAttachment"
                onChange={(url)=>{
                  if(url){
                    onSubmit({url: url});
                  }
                }}
              />
              <div className="text-xs text-muted-foreground mt-4">
                Add anything to your students might need to complete their course.
              </div>
            </div>
        )
      }
    </div>
  );
};
