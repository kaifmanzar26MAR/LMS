"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CoursePage = ({ params }: { params: { courseId: string } }) => {
  const router = useRouter();

  const fetchFirstChapter = async () => {
    try {
      const response = await axios.post(`/api/get_first_chapter`, { courseId: params.courseId });
      console.log(response.data);
      router.push(`/courses/${params.courseId}/chapters/${response.data[0]._id}`);
    } catch (error) {
      console.log(error);
      router.push('/');
    }
  };

  useEffect(() => {
    fetchFirstChapter();
  }, []);

  return <>Loading...</>;
};

export default CoursePage;
