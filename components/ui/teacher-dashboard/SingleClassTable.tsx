"use client";
import React from "react";

import { useQuery, useQueries } from "@tanstack/react-query";
import { useConversion } from "@/data-access/conversion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useParams } from "next/navigation";
import { TableSkeleton } from "@/components/TableSkeleton";
import Image from "next/image";
import StudentOptions from "./StudentOptions";
import SingleStudent from "./SingleStudent";

interface ISingular {
  dataId: string;
  studentIds: string[];
}

const SingleClassTable: React.FC<ISingular> = ({ studentIds }) => {
  const { handleDate } = useConversion();
  // Ensure studentIds is defined and is an array
  const validStudentIds = Array.isArray(studentIds) ? studentIds : [];
  // getting individual student IDs using parallel query with usequeries
  const queries = useQueries({
    queries: validStudentIds.map((id: any) => {
      return {
        queryKey: ["student", id],
        queryFn: async () => {
          const response = await fetch(`/api/about-student/${id}`);
          const result = await response.json();
          return result;
        },
      };
    }),
  });

 

  // check if there is still any student we are fetching
  const checkFetching = queries.some((item) => item.isLoading);
  if (checkFetching) {
    return <div>loading...</div>;
  }

  const arrayOfStudent = queries.map((item) => item.data);

  return (
    <Table className="bg-white overflow-x-auto    rounded-md my-6">
      <TableHeader>
        <p className="px-3 py-4 font-bold text-[15px]">Students</p>

        <TableRow className="text-[13px]">
          <TableHead>Name</TableHead>
          <TableHead className="">Email</TableHead>
          <TableHead className="">Grade</TableHead>
          <TableHead className="">Enrolled</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {arrayOfStudent.map((student: any, index) => (
          <TableRow key={index} className="">
            <TableCell className="font-bold w-[200px] flex space-x-2 text-[13px] mr-3">
              <Image
                src={student?.profilePhoto}
                alt="icon"
                width={100}
                height={100}
                className="w-[40px] rounded-md h-[40px] mr-1"
              />
              {student?.name}
            </TableCell>
            <TableCell className="text-[12px]  font-semibold">
              {student?.email}
            </TableCell>
            <TableCell className="text-[12px]  font-semibold">
              {student?.grade}
            </TableCell>
            <TableCell className="text-[12px]  font-semibold">
              {handleDate(student?.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default SingleClassTable;
