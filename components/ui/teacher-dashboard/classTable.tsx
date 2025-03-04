"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import IndividualClass from "./IndividualClass";
import Image from "next/image";
import { LoadingTable } from "@/components/TeachersTable";
import { Noitem } from "@/components/ApplicantsTable";

const ClassTable = () => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["add"],
    queryFn: async () => {
      const response = await fetch("/api/class");
      const result = await response.json();
      return result;
    },
  });
  //console.log(data)

  // If loading
  if (isLoading) {
    return (
      <div className=" mt-4">
        <LoadingTable />
      </div>
    );
  }

  // If error
  if (isError) {
    return <div className="flex-1">{error.message}</div>;
  }
  console.log(data);
  return (
    <div>
      {Array.isArray(data) && data.length < 1 ? (
        <Noitem desc="No class created, please create class" />
      ) : (
        <Table className="bg-white overflow-x-auto rounded-md mt-12">
          <TableHeader>
            <TableRow>
              <TableHead className="text-[12px] w-[100px] text-left p-2">
                Subject
              </TableHead>
              <TableHead className="text-[12px] text-left p-2">Class</TableHead>
              <TableHead className="text-[12px] text-left p-2">Grade</TableHead>
              <TableHead className="text-[12px] text-left p-2">
                Students
              </TableHead>
              <TableHead className="text-[12px] text-right p-2">
                Options
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(data) &&
              data.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="text-[13px] md:w-[250px]  w-[150px] font-bold  flex items-center gap-2">
                    <Image
                      src={`/${item?.subject.toLowerCase()}.png`}
                      alt="icon"
                      width={25}
                      height={25}
                      className="w-[25px] h-[25px]"
                    />
                    {item.subject}
                  </TableCell>
                  <TableCell className="text-[12px]  font-semibold p-2">
                    {item.className}
                  </TableCell>

                  <TableCell className="text-[12px] font-semibold p-2">
                    {item.grade}
                  </TableCell>
                  <TableCell className="text-[13px]  font-semibold p-2">
                    {item.studentIDs ? item.studentIDs.length : 0}
                  </TableCell>
                  <TableCell className="text-right text-[16px] text-lightGreen cursor-pointer p-2">
                    <IndividualClass dataId={item.id} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ClassTable;
