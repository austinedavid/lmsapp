import React from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@mui/material";

interface Iexams {
  id: string | undefined;
  sessionType: "one-on-one" | "special-request";
}

const StudentTestSession: React.FC<Iexams> = ({ id, sessionType }) => {
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["single-One-on-One-session-Exam", id],
    queryFn: async () => {
      const response = await fetch(
        `/api/get-all-exams/${sessionType}/single-exam?examId=${id}`
      );
      const result = await response.json();
      return result;
    },
    enabled: Boolean(id),
  });

  if (isFetching) {
    return (
      <div className=" w-full h-full p-2">
        <Skeleton
          variant="rectangular"
          animation={"wave"}
          className=" w-full"
          height={350}
        />
      </div>
    );
  }

  if (!id) {
    return (
      <div className=" w-full h-full flex items-center justify-center">
        <Image
          src="/noitem.avif"
          alt="noitem"
          width={200}
          height={200}
          className=" w-[200px] h-[200px]"
        />
      </div>
    );
  }
  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <section>
      <div className="flex items-center px-4 pt-3 pb-2 gap-3 ">
        <Image
          src={`/${data?.subject ? data.subject.toLowerCase() : "maths"}.png`}
          width={30}
          height={30}
          alt="Calculator"
        />
        <span className="font-bold text-[14px]">{data?.subject}</span>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test Title</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{data?.title}</TableCell>
              <TableCell>{data?.grade}</TableCell>
              <TableCell>{data?.duration} Minutes</TableCell>
              <TableCell>--</TableCell>
              <TableCell>--</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="flex items-center gap-10 pl-[20px] my-[20px] md:my-[40px]">
          <div>
            <p className="font-medium pb-4 text-[12px] md:text-[14px]">
              No of Questions
            </p>
            <span className="font-bold text-[14px]">
              {Array.isArray(data?.questions) && data?.questions.length}
            </span>
          </div>
          <div>
            <p className="font-medium pb-4 text-[12px] md:text-[14px]">
              Highest Attainable Score
            </p>
            <span className="font-bold text-[14px]">
              {Array.isArray(data?.questions) && data?.questions.length}
            </span>
          </div>
          <div>
            <p className="font-medium pb-4 text-[12px] md:text-[14px]">
              Exam Score
            </p>
            <span className="font-bold text-[14px]">{data?.score}</span>
          </div>
        </div>

        <Link
          href={`/student-dashboard/tests/${data?.id}?sessionType=${sessionType}`}
          className="ml-4"
        >
          <Button className="bg-secondary text-white text-[12px] py-3 mr-0 md:mr-6">
            View Test Details
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default StudentTestSession;
