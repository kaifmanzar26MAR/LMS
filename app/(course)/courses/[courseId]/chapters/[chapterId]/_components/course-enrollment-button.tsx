"use client"

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import axios from "axios";
import { useState } from "react";

interface EnrollbtnProps{
    courseId:string;
    price:number;
}
const CourseEnrollButton = ({courseId, price}:EnrollbtnProps) => {
  const [isLoading, setIsLoading]= useState(false);

  const onClick= async()=>{
    try {
      setIsLoading(true);
      const response= await axios.post(`/api/update_course/${courseId}/chekout`)
      window.location.assign(response.data.url);
      
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  }
  return (
    <Button className="w-full md:w-auto" size="sm" onClick={onClick} disabled={isLoading}>
        Enroll for {formatPrice(price)}
    </Button>
  )
}

export default CourseEnrollButton