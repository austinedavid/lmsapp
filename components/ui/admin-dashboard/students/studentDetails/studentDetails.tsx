"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import IndividualStudentTable from "../../IndividualStudentTable";
import { SiGoogleclassroom } from "react-icons/si";
import AdminCoursesList from "../../AdminCoursesList";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@mui/material";

const AdminStudentLoading = () => {
  return (
    <div className=" flex gap-2 flex-col">
      <Skeleton
        variant="text"
        animation="wave"
        height={80}
        className=" w-[200px]"
      />
      <div className=" w-full  border rounded-md flex gap-3 p-3">
        <Skeleton
          height={400}
          variant="rectangular"
          animation="wave"
          className=" flex-1 rounded-md"
        />
        <Skeleton
          height={400}
          variant="rectangular"
          animation="wave"
          className=" flex-2 rounded-md"
        />
      </div>
    </div>
  );
};

const StudentDetails = () => {
  const [activeComponent, setActiveComponent] = useState("personalInfo");

  const handlePersonalInfoClick = () => {
    setActiveComponent("personalInfo");
  };

  const handleCoursesClick = () => {
    setActiveComponent("courses");
  };

  const { id } = useParams();
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["SingleStudent"],
    queryFn: async () => {
      const response = await fetch(`/api/students/${id}`);
      const result = await response.json();
      return result;
    },
  });

  console.log(data)

  if (isLoading) {
    return <AdminStudentLoading />;
  }

  if (isError) {
    return <div className=" flex-1">{error.message}</div>;
  }

  return (
    <section>
      {data && (
        <div key={data.id}>
          <div className="flex justify-between items-center">
            <span className="text-[25px] font-bold my-5">
              Student/ <span className="text-[#359C71]">{data.name}</span>
            </span>
            <Link href="/admin-dashboard/students">
              <Image
                src="/svgs/close.svg"
                alt="close"
                width={100}
                height={100}
                className="w-[15px]"
              />
            </Link>
          </div>
          <div className="flex flex-col md:flex-row bg-white">
            <div className="flex-1 border-r">
              <div className="py-5 pl-6">
                <span className="text-[16px] font-bold">{data.name}</span>
                <p className="text-[12px] text-gray-500">{data.email}</p>
              </div>
              <hr />
              
              <div className="py-5 cursor-pointer">
                <div
                  className={`flex items-center py-2 px-6 gap-3 mb-2 ${
                    activeComponent === "personalInfo" ? "bg-gray-200" : ""
                  }`}
                  onClick={handlePersonalInfoClick}
                >
                  <Image
                    src="/circle-user.png"
                    alt="User"
                    width={20}
                    height={10}
                    className="rounded-[100%] h-[20px]"
                  />
                  <p className="text-[16px] font-bold">Personal Information</p>
                </div>
                <div
                  className={`flex items-center py-2 px-6 gap-3 mb-2 ${
                    activeComponent === "courses" ? "bg-gray-200" : ""
                  }`}
                  onClick={handleCoursesClick}
                >
                  <SiGoogleclassroom className="text-[18px] mr-1" />
                  <p className="text-[16px] font-bold">Courses</p>
                </div>
              </div>
              <hr />
              
            </div>
            <div className="flex-2 p-4">
              {activeComponent === "personalInfo" ? (
                <IndividualStudentTable studentData={data} />
              ) : (
                <AdminCoursesList studentData={data} />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StudentDetails;
