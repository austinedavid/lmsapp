"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LoadingSkeleton,
  ShowAllSessionProfile,
  ShowTeacher,
  StudentInfos,
} from "./SingleSessionAdmin";
import { useParams, useSearchParams } from "next/navigation";
import { ToastContainer } from "react-toastify";
import TeacherInfo from "../../teacher-login/TeacherInfo";

interface IspecialTeacher {
  teacher: {
    name: string;
    email: string;
    rating: null;
    profilePhoto: string;
  };
}

interface ISpecialRequest {
  id: string;
  studentId: string;
  amt: number;
  language: string;
  subject: string;
  grade: string;
  time: string;
  kindOfTeacher: string;
  merged: boolean;
  createdAt: string;
  student: {
    id: string;
    name: string;
    email: string;
    profilePhoto: string;
  };
  SpecialTeacherMerged: IspecialTeacher;
}

const ToggleSpecialBtn: React.FC<{
  isMerged: boolean;
  mergedTeacher: IspecialTeacher;
}> = ({ isMerged, mergedTeacher }) => {
  const [showTeacher, setShowTeacher] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const switchBtn = (stype: "noreassign" | "reassign") => {
    if (stype == "noreassign") {
      return setShowTeacher(true);
    } else {
      return setShowTeacher(false);
    }
  };
  return (
    <div className=" flex flex-col gap-2">
      {isMerged ? (
        <div>
          <div className=" flex items-center gap-2 w-full rounded-md border border-gray-500 p-1">
            <button
              onClick={() => switchBtn("noreassign")}
              className={` font-bold flex-1 py-1 rounded-md text-[13px] ${
                showTeacher
                  ? "bg-green-700 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              Merged tutor
            </button>
            <button
              onClick={() => switchBtn("reassign")}
              className={` font-bold flex-1 py-1 rounded-md text-[13px] ${
                showTeacher
                  ? "bg-gray-200 text-black"
                  : "bg-green-700 text-white"
              }`}
            >
              Reassign tutor
            </button>
          </div>
          {showTeacher ? (
            <ShowTeacher
              email={mergedTeacher.teacher.email}
              name={mergedTeacher.teacher.name}
              profilePhoto={mergedTeacher.teacher.profilePhoto}
              rating={mergedTeacher.teacher.rating!}
              autoBtn={false}
            />
          ) : (
            <ShowAllSessionProfile
              isMerged={isMerged}
              url="/api/special-request"
            />
          )}
        </div>
      ) : (
        <div>
          <ShowAllSessionProfile
            isMerged={isMerged}
            url="/api/special-request"
          />
        </div>
      )}
    </div>
  );
};

const SingleSpecialRequest = () => {
  const { id } = useParams();
  const query = useSearchParams();
  const { isLoading, data, isError, error } = useQuery<ISpecialRequest>({
    queryKey: ["single-special-request"],
    queryFn: async () => {
      const response = await fetch(`/api/special-request/${id}`);
      const result = await response.json();
      return result;
    },
  });

  if (isLoading) {
    return <LoadingSkeleton title="Single unmerged special request" />;
  }

  if (isError) {
    return (
      <div>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className=" w-full flex items-center justify-center">
        <p className=" mb-4 text-black font-bold text-[24px]">
          Single {query.get("merged") === "true" ? "merged" : "unmerged"}{" "}
          session
        </p>
      </div>
      <div className=" w-full md:px-20">
        <div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-3 border-2 px-4 py-2 rounded-md shadow-md ">
          <StudentInfos
            email={data?.student.email!}
            name={data?.student.name!}
            profilePhoto={data?.student.profilePhoto!}
            sectionType={"Special Request"}
            grade={data?.grade!}
            daytime={data?.time}
            createdAt={data?.createdAt!}
            amt={data?.amt!}
            merged={data?.merged!}
            kindofteacher={data?.kindOfTeacher!}
            specialRequest={true}
          />
          <ToggleSpecialBtn
            mergedTeacher={data?.SpecialTeacherMerged!}
            isMerged={data?.merged!}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SingleSpecialRequest;
