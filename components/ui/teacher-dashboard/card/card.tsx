"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BsBroadcast } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";

// all the types
interface IAllClass {
  allClasses: number;
}
interface IAllStudent {
  allStudent: number;
}
interface IAllResouce {
  allResource: number;
}
interface IRatting {
  rattings: number;
}
// below are for total classes
const TotalClasses = () => {
  const { data: allClass = { allClasses: 0 } } = useQuery<IAllClass>({
    queryKey: ["allclasses-teacher1"],
    queryFn: async () => {
      const response = await fetch("/api/teacher-card-info/total-class");
      const result = await response.json();
      return result;
    },
  });
  return (
    <div className="flex flex-1   text-sm  p-3  justify-between space-x-2  bg-white rounded-md">
      <div className="flex flex-col  justify-evenly">
        <h3 className="font-bold text-lg pb-3">{allClass.allClasses}</h3>
        <p className="font-semibold pb-2 ">Total Classes</p>
      </div>
      <Image
        src="/book.png"
        alt="card-img"
        width={50}
        height={50}
        className="w-[30px] h-[30px] justify-end mt-5 items-center"
      />
    </div>
  );
};

// below is for total students
const TotalStudent = () => {
  const { data: totalStudent = { allStudent: 0 } } = useQuery<IAllStudent>({
    queryKey: ["allstudent-teacher"],
    queryFn: async () => {
      const response = await fetch("/api/teacher-card-info/total-student");
      const result = await response.json();
      return result;
    },
  });
  return (
    <div className="flex flex-1  text-sm  p-3  justify-between space-x-2  bg-white rounded-md">
      <div className="flex flex-col  justify-evenly">
        <h3 className="font-bold text-lg pb-3">{totalStudent.allStudent}</h3>
        <p className="font-semibold pb-2 ">Total Students</p>
      </div>
      <Image
        src="/student.png"
        alt="card-img"
        width={50}
        height={50}
        className="w-[30px] h-[30px] justify-end mt-5 items-center"
      />
    </div>
  );
};

const TotalTestAndResources = () => {
  const { data: totalResources = { allResource: 0 } } = useQuery<IAllResouce>({
    queryKey: ["allresources-teacher"],
    queryFn: async () => {
      const response = await fetch("/api/teacher-card-info/total-exams");
      const result = await response.json();
      return result;
    },
  });
  return (
    <div className="flex flex-1  text-sm  p-3  justify-between space-x-2  bg-white rounded-md">
      <div className="flex flex-col  justify-evenly">
        <h3 className="font-bold text-lg pb-3">{totalResources.allResource}</h3>
        <p className="font-semibold pb-2 ">Tests & Resources</p>
      </div>
      <Image
        src="/resources.png"
        alt="card-img"
        width={50}
        height={50}
        className="w-[30px] h-[30px] justify-end mt-5 items-center"
      />
    </div>
  );
};

const Ratting = () => {
  const { data: totalRate = { rattings: 0 } } = useQuery<IRatting>({
    queryKey: ["allrattings-teacher"],
    queryFn: async () => {
      const response = await fetch("/api/teacher-card-info/ratting");
      const result = await response.json();
      return result;
    },
  });
  return (
    <div className="flex flex-1  text-sm  p-3  justify-between space-x-2  bg-white rounded-md">
      <div className="flex flex-col  justify-evenly">
        <h3 className="font-bold text-lg pb-3">{totalRate.rattings}</h3>
        <p className="font-semibold pb-2 ">Rating</p>
      </div>
      <Image
        src="/rating.png"
        alt="card-img"
        width={50}
        height={50}
        className="w-[30px] h-[30px] justify-end mt-5 items-center"
      />
    </div>
  );
};

const Card = () => {
  const router = useRouter();
  return (
    <div className="w-full bg-stone-100">
      {/* Card section */}
      <div className="md:flex md:flex-row  gap grid grid-cols-1 justify-between  items-center gap-3">
        <TotalClasses />
        <TotalStudent />
        <TotalTestAndResources />
        <Ratting />
        {/* Go Live */}
        <div className="flex flex-col space-y-3 flex-1 ">
          <div
            onClick={() => router.push("/teacher-dashboard/classroom")}
            className=" bg-dimOrange flex items-center justify-center py-4 cursor-pointer rounded-md text-white text-[14px] mt-3  ml-3 md:w-32 w-full mx-auto  "
          >
            <BsBroadcast className="inline mr-1" />
            <p>Start class</p>
          </div>
          <p className="text-[10px] text-center  font-normal">
            Create or start your class now!!!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
