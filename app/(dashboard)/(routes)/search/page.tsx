"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Categories } from "./_components/categories";
import { SearchInput } from "@/components/search-input";
import { CourseList } from "./_components/course-list";
type SearchProps = {
  title?: string;
  categoryId?: string;
};
const Search = ({ searchParams }: SearchProps) => {
  const abort = new AbortController();
  const [allCategories, setALlCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const fetchAllCategories = async () => {
    try {
      const response = await axios.get("/api/get_all_category");
      if (response.status === 200 && response.data) {
        console.log(response.data);
        setALlCategories(response.data);
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.log("Something went Worong!", error);
      toast.error(`Error: ${"An error in fetching categories"}`);
    }
  };
  const fetchAction = async () => {
    try {
      const response = await axios.post(
        "/api/action",
        {
          title: searchParams.title,
          categoryId: searchParams.categoryId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("resp", response.data);
      setCourses(response.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchAllCategories();
  }, []);
  useEffect(() => {
    console.log(searchParams);

    fetchAction();
    return () => {
      return abort.abort();
    };
  }, [searchParams]);
  return (
    <>
      {
        <div className="px-6 pt-6 md:hidden md:mb-0 block">
          <SearchInput />
        </div>
      }
      <div className="p-6 space-y-4">
        <Categories items={allCategories} />
        <CourseList courses={courses} />
      </div>
    </>
  );
};

export default Search;
