"use client";
import React, { useState } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { Skeleton } from "@mui/material";
import StudentViewTestDetails from "./StudentViewTestDetails";
import StudentViewQuestions from "./StudentViewQuestions";

const StudentTestOverview = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const sessionType = searchParams.get("sessionType");
  const [displayComponent, setDisplayComponent] = useState(true);

  const examEndpoint = `/api/get-all-exams/${sessionType}/single-exam?examId=${id}`;

  const queryclient = useQueryClient();
  const router = useRouter();
  const handleDisplayComponent = () => {
    setDisplayComponent(false);
  };
  const { data, isFetching, error, isError } = useQuery({
    queryKey: ["getingoneexam", id, sessionType],
    queryFn: async () => {
      const response = await fetch(examEndpoint);
      const result = await response.json();
      return result;
    },
  });

  // return loading component if is fetching
  if (isFetching) {
    return (
      <div className=" w-full">
        <p className=" text-black font-bold">Details</p>
        <div className=" w-full md:w-2/5">
          <Skeleton
            height={500}
            variant="rectangular"
            animation="wave"
            className=" w-full"
          />
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      {displayComponent ? (
        <StudentViewTestDetails
          data={data}
          onClickChange={handleDisplayComponent}
        />
      ) : (
        <StudentViewQuestions
          data={data}
          onClickChange={handleDisplayComponent}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default StudentTestOverview;
