"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Container from "./Container";
import { z } from "zod";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { studentTestSchema } from "@/constants/studentTest";
import { useConversion } from "@/data-access/conversion";
import { Skeleton } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentTestSession from "./StudentTestSession";
import StudentTestSpecialSession from "./StudentTestSpecialSession";

export type IStudentTest = z.infer<typeof studentTestSchema>;

interface SpecialExam {
  id: string;
  title: string;
  subject: string;
  createdAt: string;
  duration: string;
  grade: string;
  percentage: string;
  completed: boolean;
  score: number;
}

interface IQuestions {
  question: string;
  answer: string;
  studentAnswer: string;
  options: string[];
}

interface ISessionExam {
  questions: IQuestions[];
  id: string;
  completed: boolean;
  score: number;
  percentage: string;
  title: string;
  grade: string;
  subject: string;
  duration: string;
  appliedSectionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface modefiedExamType extends IStudentTest {
  createdAt: string;
  id: string;
}

const LoadingView: React.FC<{ heading: string }> = ({ heading }) => {
  const mappingArray = new Array(3).fill("");
  return (
    <div className=" flex flex-col px-2 gap-3">
      <div className="font-bold text-[12px] px-5 pt-2 pb-3 text-gray-400">
        {heading}
      </div>
      <div className=" flex flex-col gap-2">
        {mappingArray.map((item, index) => (
          <Skeleton
            variant="rectangular"
            animation={"wave"}
            height={60}
            key={index}
            className=" w-full rounded-md"
          ></Skeleton>
        ))}
      </div>
    </div>
  );
};
interface IallSession {
  setId: React.Dispatch<React.SetStateAction<string | undefined>>;
  id: string | undefined;
  setShowExam: React.Dispatch<React.SetStateAction<boolean>>;
  showExam: boolean;
}
// component that will return all the test
const AllSession: React.FC<IallSession> = ({
  setId,
  id,
  setShowExam,
  showExam,
}) => {
  const { data: session } = useSession();

  const studentId = session?.user?.id;

  const { getTimeAgo, handleDate, handleTime } = useConversion();
  // here we get all the one-on-one session tests and exams
  const { data, isLoading, isError, error } = useQuery<ISessionExam[]>({
    queryKey: ["allSession", studentId],
    queryFn: async () => {
      if (!studentId) return [];
      const response = await fetch(
        `/api/get-all-exams/one-on-one?studentId=${studentId}`
      );
      const result = await response.json();

      return result;
    },
    enabled: !!studentId,
  });

  console.log(data);

  if (isLoading) {
    return <LoadingView heading="One-On-One Session Test" />;
  }
  if (isError) {
    return <div>{error.message}</div>;
  }

  if (data && id == undefined) {
    const emptyArray = Array.isArray(data) && data.length > 0;
    if (!emptyArray) {
      setId(undefined);
    } else {
      const firstId = Array.isArray(data) && data[0].id;
      if (!id) {
        setId(firstId as string);
      }
    }
  }
  const handleChange = (theid: string) => {
    setId(theid);
    setShowExam(true);
  };
  return (
    <div className=" pt-3 flex flex-col gap-2">
      <p className="font-bold text-[12px] px-5 text-gray-400">
        One-On-One Session Tests
      </p>
      {Array.isArray(data) && (
        <div>
          {data.length === 0 ? (
            <div className=" w-full flex items-center justify-center flex-col gap-2">
              <Image
                priority
                src="/noitem.avif"
                alt="noitem"
                width={200}
                height={200}
                className=" w-[120px] h-[120px]"
              />
              <div className=" px-4 py-2 border border-green-700 rounded-md text-sm">
                <p>no One-On-One session test here</p>
              </div>
            </div>
          ) : (
            <div className=" flex flex-col gap-2">
              {data.map((exam, index) => (
                <div
                  onClick={() => handleChange(exam.id)}
                  key={index}
                  className={`cursor-pointer transition-all ease-in-out duration-700 hover:bg-[#359C7133] ${
                    id == exam.id && "bg-[#359C7133]"
                  }`}
                >
                  <div className="flex items-center px-5 pt-3 pb-2 gap-3 ">
                    <Image
                      src={`/${exam?.subject.toLowerCase()}.png`}
                      width={30}
                      height={30}
                      alt="Calculator"
                    />
                    <span className="font-bold text-[14px]">
                      {exam?.subject}
                    </span>
                  </div>
                  <div className="flex gap-2 text-[12px] font-medium pb-3 pl-[20px] md:pl-[60px]">
                    <span>{handleDate(exam?.createdAt)}</span>
                    <span>{handleTime(exam?.createdAt)}</span>
                    <span>{getTimeAgo(exam?.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// component that will return all the special session tests

const AllSpecialSession: React.FC<IallSession> = ({
  id,
  setId,
  setShowExam,
}) => {
  const { data: session } = useSession();
  const studentId = session?.user?.id;

  const { handleDate, handleTime, getTimeAgo, makeSubstring } = useConversion();
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["all-special-exams", studentId],
    queryFn: async () => {
      if (!studentId) {
      }
      const response = await fetch(
        `/api/get-all-exams/special-request?studentId=${studentId}`
      );
      const result = await response.json();
      console.log("Fetched Special Request Exams:", result);
      return result;
    },
    enabled: !!studentId,
  });

  if (isLoading) {
    return <LoadingView heading="Special Request Tests" />;
  }
  if (isError) {
    return <div>{error.message}</div>;
  }
  const handleChange = (theid: string) => {
    setId(theid);
    setShowExam(false);
  };

  const specialExams: SpecialExam[] = Array.isArray(data)
    ? data.flatMap((item) => item.SpecialStudentExam || [])
    : [];

  return (
    <div>
      <p className="font-bold text-[12px] px-5 py-3 text-gray-400">
        Special Request Tests
      </p>

      <div>
        {specialExams.length === 0 ? (
          <div className=" w-full flex items-center justify-center flex-col gap-2 mb-2">
            <Image
              priority
              src="/noitem.avif"
              alt="noitem"
              width={200}
              height={200}
              className=" w-[120px] h-[120px]"
            />
            <div className=" px-4 py-2 border border-green-700 rounded-md text-sm">
              <p>no special request tests here</p>
            </div>
          </div>
        ) : (
          <div className=" flex flex-col gap-2">
            {specialExams.map((SpecialStudentExam, index) => (
              <div
                onClick={() => handleChange(SpecialStudentExam.id)}
                key={index}
                className={`cursor-pointer transition-all ease-in-out duration-700 hover:bg-[#359C7133] ${
                  id == SpecialStudentExam.id && "bg-[#359C7133]"
                }`}
              >
                <div className="flex items-center px-5 pt-3 pb-2 gap-3 ">
                  <Image
                    src={`/${
                      SpecialStudentExam?.subject
                        ? SpecialStudentExam.subject.toLowerCase()
                        : "default"
                    }.png`}
                    width={30}
                    height={30}
                    alt="Calculator"
                  />
                  <span className="font-bold text-[14px]">
                    {SpecialStudentExam?.subject}
                  </span>
                </div>
                <div className="flex gap-2 text-[12px] font-medium pb-3 pl-[20px] md:pl-[60px]">
                  <span>{handleDate(SpecialStudentExam?.createdAt)}</span>
                  <span>{handleTime(SpecialStudentExam?.createdAt)}</span>
                  <span>{getTimeAgo(SpecialStudentExam?.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StudentTestAndResources = () => {
  const [showexam, setShowexam] = useState(true);
  const [id, setId] = useState<undefined | string>(undefined);
  const [dialog, setDialog] = useState<boolean>(false);
  console.log(id);
  return (
    <section>
      <Container>
        <div className=" flex flex-col md:flex-row gap-4">
          <div className="flex-2 ">
            <div className=" bg-[#FFFFFF] rounded-[8px] w-full pb-2">
              <AllSession
                setShowExam={setShowexam}
                id={id}
                setId={setId}
                showExam={showexam}
              />
              <AllSpecialSession
                setShowExam={setShowexam}
                id={id}
                setId={setId}
                showExam={showexam}
              />
            </div>
          </div>
          <div className="flex-3 bg-[#FFFFFF] h-[70vh] rounded-[8px] p-5">
            {showexam ? (
              <StudentTestSession id={id} />
            ) : (
              <StudentTestSpecialSession id={id} />
            )}
          </div>
        </div>
      </Container>
      <ToastContainer />
    </section>
  );
};

export default StudentTestAndResources;
