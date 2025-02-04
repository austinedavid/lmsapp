"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Container from "./Container";
import Link from "next/link";
import { ICourses, CourseCard } from "./Courses";
import { GetClassLoader } from "./loaders/skeleton";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MoreCourseBtn = () => {
  return (
    <div className=" w-full flex items-center justify-center mt-3">
      <Link
        className=" px-4 py-2 rounded-md bg-orange-500 text-white"
        href={"/courses"}
      >
        More courses
      </Link>
    </div>
  );
};
const PopularCourseHeadings = () => {
  return (
    <div className="w-full  flex flex-col items-center">
      <h2 className="text-2xl font-header text-lightGreen font-bold">
        {" "}
        <span className="hidden  md:inline-flex w-20 md:w-60 mb-2 py-[.5px]  lgl:w-72 h-[.5px] bg-lightGreen mr-6"></span>
        Popular Courses{" "}
        <span className="hidden md:inline-flex mb-2 w-20 py-[.5px] md:w-60 lgl:w-72 h-[.5px] bg-lightGreen ml-6"></span>
      </h2>
    </div>
  );
};
const SampleCourses = () => {
  const { data, isLoading, error, isError } = useQuery<ICourses[]>({
    queryKey: ["sample_courses"],
    queryFn: async () => {
      const response = await fetch("/api/sample-course");
      const result = await response.json();
      return result;
    },
  });
  if (isLoading) {
    return (
      <Container>
        <PopularCourseHeadings />
        <GetClassLoader />
      </Container>
    );
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className=" mt-6">
      <Container>
        {Array.isArray(data) && (
          <div>
            {data.length > 0 && (
              <div>
                <PopularCourseHeadings />
                <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {data.map((item, index) => (
                    <CourseCard key={index} item={item} />
                  ))}
                </div>
                <MoreCourseBtn />
              </div>
            )}
          </div>
        )}

        <ToastContainer />
      </Container>
    </div>
  );
};

export default SampleCourses;
