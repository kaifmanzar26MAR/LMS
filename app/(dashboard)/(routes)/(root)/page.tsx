"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { CourseList } from "../search/_components/course-list";
import { CheckCircle, Clock } from "lucide-react";
import InfoCard from "./_components/info-card";
export default function Dashboard() {
  const [courseData, setCourseData] = useState();
  const [allCourse, setAllCourse] = useState();
  const [notCompleted, setNotCompleted]=useState(0);
  const [completed, setCompleted]=useState(0);
  const fetchData = async () => {
    try {
      const responce = await axios.post("/api/get_dashboard_courses", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(responce.data);
      setCourseData(responce.data.courseCompleteProgress);
      setAllCourse(responce.data.allData);
      const inProgress= responce.data.courseCompleteProgress.filter((ele:any)=>{
        return ele.isCompleted===false;
      })
      setNotCompleted(inProgress.length);
      setCompleted(responce.data.courseCompleteProgress.length - inProgress.length);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  if (!allCourse || !courseData) return <>Loading...</>;
  return (
    <div className="p-6 space-y-4">
      {/* <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard icon={Clock} label="In Progress" numberOfItems={notCompleted} variant="default"/>
        <InfoCard icon={CheckCircle} label="Completed" numberOfItems={completed} variant="sucess"/>
      </div>
      <CourseList courses={allCourse} />
    </div>
  );
}
