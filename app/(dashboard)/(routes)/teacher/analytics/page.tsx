"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { DataCard } from "./_components/data-card";
import Chart from "./_components/chart";

function AnalyticsPage() {
    const [soldCourse, setSoldCourse]=useState(0);
    const [totalRevinew, setTotalRevinew]=useState(0);
    const [data, setData]=useState([]);
    const fetchData= async()=>{
        try {
            const response= await axios.get("/api/teacher_dashboard", {
                headers:{
                    "Content-Type":"application/json"
                }
            })
            console.log(response.data)
            setSoldCourse(response.data.soldCourses.length);
            setTotalRevinew(response.data.totalRevinew);
            setData(response.data.data);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
       fetchData();
    },[]);

    
    return ( 
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <DataCard label="Total Sales" value={soldCourse} />
            <DataCard label="Total Revinew" value={totalRevinew} shouldFormat/>

          </div>
          <Chart data={data}/>
        </div>
     );
}

export default AnalyticsPage;