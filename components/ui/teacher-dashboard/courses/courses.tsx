"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useClasses } from "@/data-access/class";
import Image from "next/image";
import { FaGraduationCap } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import Container from "@/components/Container";
import Link from "next/link";
import EditCourses from "./EditCourses";
import RemoveCourse from "./RemoveCourse";
import { Skeleton } from "@mui/material";
import { Noitem } from "@/components/ApplicantsTable";
import SinglePurchasedCourse from "./SinglePurchasedCourse";
import RemovePurchasedCourse from "./RemovePurchasedCourse";
import { ModifiedNoProfile } from "../../admin-dashboard/sessions/Sessions";
import { CourseCreator } from "@/components/Courses";

export interface TeacherInfo {
  id: string;
  name: string;
  profilePhoto: string | null;
  status: string;
}

export interface ICourses {
  id: string;
  byAdmin: boolean;
  grade: string;
  details: string;
  teacherId: number;
  title: string;
  courseId: string;
  banner: string;
  subject: string;
  previewVideo: string;
  mainVideo: string;
  price: number;
  sellCount: string;
  createdAt: string;

  CourseInfo?: {
    teacher: TeacherInfo;
  };
  teacher: TeacherInfo;
}

const ShowSkeleton = () => {
  const myArray = new Array(6).fill(" ");
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {myArray.map((_, index) => (
        <Skeleton
          key={index}
          className="w-full rounded-md"
          height={250}
          variant="rectangular"
          animation="wave"
        />
      ))}
    </div>
  );
};

const CourseCard: React.FC<{ item: ICourses }> = ({ item }) => {
  const { makeSubString } = useClasses();
  return (
    <div className="w-full overflow-hidden font-header rounded-lg card flex flex-col justify-center gap-3 hover:-translate-y-2 transition-transform duration-300 group">
      <div className="relative text-white w-full h-[200px]">
        <Image
          className="w-full h-full object-cover"
          src={item.banner}
          alt="background"
          width={200}
          height={200}
        />
        <EditCourses id={item.id} />
        <RemoveCourse id={item.id} />
      </div>
      <div className="flex justify-between px-2">
        <p className="font-bold mt-3 bg-[rgba(0,0,0,0.6)] text-white p-2 rounded-md">
          <span className="text-[14px] font-semibold">Sold:</span>{" "}
          {item.sellCount}
        </p>
        <p className="font-bold mt-3 text-lightGreen">${item.price}</p>
      </div>
      <div className="flex flex-col gap-3 mb-8 justify-center mx-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-bold">{item.title}</p>
            </div>
            <div className="flex items-center pt-1 gap-2">
              <p className="text-[13px] font-subtext font-medium">
                <FaGraduationCap className="inline mr-1 text-lg" />
                {item.byAdmin
                  ? "SchooledAfrika"
                  : makeSubString(item.teacher.name)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-green-200 px-2 py-1 rounded-md">
            <MdVerified className="text-green-700" />
            <p className="text-green-700 text-[10px]">verified</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AllTeacherCreatedCourses = () => {
  const {
    data: coursesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getCourse"],
    queryFn: async () => {
      const response = await fetch("/api/created-course-byteacher");
      const result = await response.json();
      return result;
    },
  });

  console.log(coursesData);
  if (isLoading) {
    return <ShowSkeleton />;
  }
  if (isError) {
    return <p>{error.message}</p>;
  }
  return (
    <div className=" flex flex-col gap-3">
      <h2 className="font-bold text-center text-[25px]">Created Courses</h2>
      {Array.isArray(coursesData) && coursesData.length === 0 ? (
        <Noitem desc="No new courses" />
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 p-4 gap-3">
          {coursesData?.map((item: ICourses, index: number) => (
            <CourseCard item={item} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export const PurchasedCourseCard: React.FC<{ item: ICourses }> = ({ item }) => {
  return (
    <div className="w-full overflow-hidden font-header rounded-lg card flex flex-col justify-center gap-3 hover:-translate-y-2 transition-transform duration-300 group">
      <div className="relative text-white w-full h-[200px]">
        <Image
          className="w-full h-full object-cover"
          src={item.banner}
          alt="background"
          width={200}
          height={200}
        />

        <SinglePurchasedCourse
          title={item.title}
          details={item.details}
          teacherPhoto={item.CourseInfo?.teacher?.profilePhoto!}
          teacher={item.CourseInfo?.teacher?.name!}
          banner={item.banner}
          previewVideo={item.previewVideo}
          mainVideo={item.mainVideo}
          price={item.price}
          id={item.id}
          byAdmin={item.byAdmin}
        />

        <RemovePurchasedCourse courseId={item.id} />
      </div>

      <div className="flex flex-col gap-3 mb-2 justify-center mx-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mt-6 gap-2">
              <p className="text-[14px] font-bold">{item.title}</p>
            </div>
            <div className="flex mt-2">
              <CourseCreator
                name={item.CourseInfo?.teacher.name!}
                byAdmin={item.byAdmin}
                profilePhoto={item.CourseInfo?.teacher.profilePhoto!}
              />
            </div>
          </div>
          <div className="flex items-center gap-1 bg-green-200 px-2 py-1 rounded-md">
            <MdVerified className="text-green-700" />
            <p className="text-green-700 text-[10px]">verified</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AllPurchasedCourses = () => {
  const {
    data: purchasedCourseData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getPurchasedCourseByTeacher"],
    queryFn: async () => {
      const response = await fetch("/api/courses-bought");
      const result = await response.json();
      return result;
    },
  });
  if (isLoading) {
    return <ShowSkeleton />;
  }
  if (isError) {
    return <p>{error.message}</p>;
  }
  console.log(purchasedCourseData);
  return (
    <div className=" flex flex-col gap-3">
      <h2 className="font-bold text-center text-[25px]">Purchased Courses</h2>
      {Array.isArray(purchasedCourseData) &&
      purchasedCourseData.length === 0 ? (
        <Noitem desc="No purchased courses" />
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 p-4 gap-3">
          {purchasedCourseData?.map((item: ICourses, index: number) => (
            <PurchasedCourseCard item={item} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};
