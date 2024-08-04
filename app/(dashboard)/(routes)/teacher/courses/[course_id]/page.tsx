"use client";

import { IconBadge } from "@/components/icon-badge";
import axios from "axios";
import { CircleDollarSign, LayoutDashboard, ListCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";

interface CourseDataProps {
  _id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  categoryId?: string;
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
    courseData.categoryId,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
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
            <div>
              TODO: Chapters
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign}/>
              <h2 className="text-xl">Sell your course</h2>
            </div>
          </div>
          <PriceForm
          initialData={courseData}
          courseId={courseData._id}
          />

        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
