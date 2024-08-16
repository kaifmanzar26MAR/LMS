"use client"

import { Button } from "@/components/ui/button";
import Link  from "next/link";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { useEffect, useState } from "react";
import axios from "axios";


interface AttachmentProps{
  _id: string;
  name:string;
  courseId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChapterProps{
  _id:string,
  title:string,
  description:string,
  videoUrl:string,
  position:number,
  isPublished:boolean,
  isFree:boolean,
}
type Course={
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryId: string;
  isPublished:boolean;
  attachments: AttachmentProps[];
  chapters?:ChapterProps[];
  createdAt:Date;
  updatedAt:Date;
}
function CoursesPage() {

 

  const [data, setData]=useState<Course[]>([]);
  const [isLoading, setIsLoading]=useState<boolean>(false);

  const fetchData=async ()=>{
    try {
      setIsLoading(true);
      const response= await axios.get('/api/get_all_courses');
      setData(response.data);
    } catch (error) {
      console.log(error)
    }finally{
      setIsLoading(false)
    }
  }
  
  useEffect(()=>{
    fetchData();
  },[])
  return (
    <div className="p-6">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default CoursesPage;
