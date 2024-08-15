"use client";

import { IconBadge } from "@/components/icon-badge";
import axios from "axios";
import { CircleDollarSign, File, LayoutDashboard, ListCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { Attachment } from "./_components/attachment-form";
import { ChapterForm } from "./_components/chapters-form";
import { Banner } from "@/components/banner";
import { CourseAction } from "./_components/course-action";

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

interface CourseDataProps {
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

interface CategoryProps{
  _id:string,
  name:string
}

const CourseIdPage = ({ params }: { params: { course_id: string } }) => {
  const router = useRouter();
  const [courseData, setCourseData] = useState<CourseDataProps | null>(null);
  const [allCategories, setALlCategories]=useState([]);
  const fetchCourseData = async () => {
    try {
      const response = await axios.post("/api/get_a_course", {
        _id: params.course_id,
      });

      if (response.status === 200 && response.data) {
        setCourseData(response.data);
        console.log(response.data);
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error("Something went wrong!", error);
      toast.error(`Error: ${"An error occurred"}`);
      router.push("/");
    }
  };

  const fetchAllCategories=async()=>{
    try {
      const response= await axios.get("/api/get_all_category");
      if (response.status === 200 && response.data) {
        console.log(response.data)
        setALlCategories(response.data);
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.log("Something went Worong!", error);
      toast.error(`Error: ${"An error in fetching categories"}`);
    }
  }

  useEffect(() => {
    fetchCourseData();
    fetchAllCategories();
  }, [params.course_id]);


  

  if (!courseData) {
    return <>Loading..</>;
  }

  const requiredFields = [
    courseData.title,
    courseData.description,
    courseData.imageUrl,
    courseData.price,
    courseData.categoryId
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete= completedFields===totalFields

  return (
    <>
    {
      !courseData.isPublished && (
        <Banner
        variant="warning"
        label="This chapter is unpublished. It will not be visible to the students."/>
      )
    }
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
        <CourseAction
          disabled={!isComplete}
          courseId={params.course_id}
          isPublished={courseData.isPublished}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <TitleForm
            initialData={courseData}
            courseId={courseData._id}
          />
          <DescriptionForm
            initialData={courseData}
            courseId={courseData._id}
          />
          <ImageForm
            initialData={courseData}
            courseId={courseData._id}
          />
          <CategoryForm
            initialData={courseData}
            courseId={courseData._id}
            options={allCategories.map((category:CategoryProps)=>({
              label:category.name,
              value: category._id
            }))}
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListCheck}/>
              <h2 className="text-xl">Course Chapters</h2>
            </div>
            <ChapterForm
            initialData={courseData}
            courseId={courseData._id}
          />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign}/>
              <h2 className="text-xl">Sell your course</h2>
            </div>
            <PriceForm
            initialData={courseData}
            courseId={courseData._id}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File}/>
              <h2 className="text-xl">Resources and Attachments</h2>
            </div>
            <Attachment
              initialData={courseData}
              courseId={courseData._id}
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CourseIdPage;
