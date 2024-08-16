"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Categories } from "./_components/categories";

const Search=()=> {
    const [allCategories, setALlCategories]=useState([])
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
    useEffect(()=>{
        fetchAllCategories();
    },[])
    return ( 
        <div className="p-6">
            <Categories items={allCategories}/>
        </div>
     );
}

export default Search;