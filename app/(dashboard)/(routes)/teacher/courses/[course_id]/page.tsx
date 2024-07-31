"use client";

import { IconBadge } from "@/components/icon-badge";
import axios from "axios";
import { LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TitleForm } from "./_components/title-form";

const CourseIdPage = ({ params }: { params: { course_id: string } }) => {
  const router = useRouter();
  const [courseData, setCourseData] = useState(null);
  const fetchCourseData = async () => {
    try {
      const response = await axios.post("/api/get_a_course", {
        _id: params.course_id,
      });
      if (!response) {
        throw new Error("cant get response");
      }
      console.log(response.data);

      setCourseData(response.data);
      console.log(response.data.title);
    } catch (error) {
      console.log("Something went wrong!", error);
      toast.error("error");
      router.push("/");
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, []);
  if (!courseData) {
    return <>Loading..</>;
  }
  const requiredFields = [
    courseData?.title,
    courseData?.description,
    courseData?.imageUrl,
    courseData?.price,
    courseData?.categoryId,
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
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
