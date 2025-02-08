"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentExamSchema } from "@/constants/studentExam";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Container from "@/components/Container";
import Backwards from "../../Backwards";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

//export type IstudentExam = z.infer<typeof studentExamSchema>;

interface IQuestion {
  question: string;
  answer: string;
  studentAnswer: string;
  option: string[];
}

interface IstudentExam {
  answeredExam?: IQuestion[];
  answeredTest?: IQuestion[];
}

const StudentExam = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const id = searchParams.get("examId");
  const examType = searchParams.get("examType");
  const examStartedParam = searchParams.get("examStarted");
  const [examStarted, setExamStarted] = useState(examStartedParam === "true");
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);

  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IstudentExam>({
    resolver: zodResolver(studentExamSchema),
    defaultValues:
      examType === "group-exam"
        ? { answeredExam: [] } // Correctly typed empty array
        : { answeredTest: [] }, // Correctly typed empty array
  });

  const [questions, setQuestions] = useState<IQuestion[]>([]);

  // Save and restore remaining time from localStorage
  useEffect(() => {
    const savedTime = localStorage.getItem("remainingTime");
    if (savedTime) {
      setRemainingTime(parseInt(savedTime));
    }
  }, []);

  const saveRemainingTime = (time: number | null) => {
    if (time !== null) {
      localStorage.setItem("remainingTime", time.toString());
    } else {
      localStorage.removeItem("remainingTime");
    }
  };

  // Timer logic with reset on new exam
  useEffect(() => {
    if (
      examStarted &&
      remainingTime !== null &&
      remainingTime > 0 &&
      !isExamSubmitted
    ) {
      timerIdRef.current = setInterval(() => {
        setRemainingTime((prevTime) => {
          const time = prevTime !== null ? prevTime : 0;
          if (time <= 1) {
            clearInterval(timerIdRef.current!); // Stop timer
            setIsTimeUp(true);
            handleSubmitExam(); // Automatically submit exam if time is up
            toast.warn("Time is up! Your exam has been submitted.");
            return 0; // Ensure remaining time does not go below 0
          }
          const newTime = time - 1;
          saveRemainingTime(newTime);
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timerIdRef.current!);
    } else if (isExamSubmitted || remainingTime === 0) {
      clearInterval(timerIdRef.current!); // Stop timer if time is up or exam is submitted
    }
  }, [examStarted, remainingTime, isExamSubmitted]);

  const getExamEndpoint = (type: string | null, id: string | null) => {
    if (!id) return null;
    switch (type) {
      case "one-on-one-session":
        return `/api/session-exam?examId=${id}`;
      case "special-request-session":
        return `/api/student-special-request/exams?examId=${id}`;
      default:
        return `/api/class-exam?examId=${id}`; // Default to group class exams
    }
  };

  const {
    data,
    isLoading: queryLoading,
    error,
  } = useQuery({
    queryKey: ["getStudentExams", id],
    queryFn: async () => {
      const endpoint = getExamEndpoint(examType, id);
      if (!endpoint) throw new Error("Invalid Exam ID");
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Error fetching exam data");
      return response.json();
    },
    enabled: !!id,
  });

  console.log(data);

  // When loading a new exam, reset the timer based on new data

  useEffect(() => {
    if (data && data.duration && remainingTime === null) {
      const durationInSeconds = parseInt(data.duration) * 60;
      setRemainingTime(durationInSeconds);
      saveRemainingTime(durationInSeconds);
    }
  }, [data, remainingTime]);

  // Load the score from localStorage only if the exam has been submitted or time is up
  useEffect(() => {
    if (isExamSubmitted || isTimeUp) {
      const savedScore = localStorage.getItem("score");
      if (savedScore) {
        setScore(savedScore);
      }
    }
  }, [isExamSubmitted, isTimeUp]);

  const mutation = useMutation({
    mutationKey: ["submitExam"],
    mutationFn: async (data: IstudentExam) => {
      let method = examType === "group-exam" ? "POST" : "PUT";
      let endpoint =
        examType === "group-exam"
          ? "/api/class-exam"
          : examType === "one-on-one-session"
          ? "/api/session-exam"
          : "/api/student-special-request/exams";

      // Correctly structure the exam data
      const examData =
        examType === "group-exam"
          ? {
              ...data,
              examId: id,
              answeredExam:
                data.answeredExam?.map((exam) => ({
                  question: exam.question,
                  answer: exam.answer,
                  studentAnswer: exam.studentAnswer ?? "", // Ensure string, not null
                  options: exam.option,
                })) ?? [],
            }
          : {
              studentExamId: id,
              answeredTest:
                data.answeredTest?.map((exam) => ({
                  question: exam.question,
                  answer: exam.answer,
                  studentAnswer: exam.studentAnswer ?? "", // Ensure string, not null
                  options: exam.option,
                })) ?? [],
            };

      const response = await fetch(endpoint, {
        method,
        body: JSON.stringify(examData),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Error submitting exam");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getStudentExams"] });
      setScore(data.message);
      localStorage.setItem("score", data.message);
      setIsExamSubmitted(true);
      reset();
      saveRemainingTime(null);
      toast.success("You have successfully submitted the exam!");
      setLoading(false);
    },
    onError: (error) => {
      console.error("Submission error:", error);
      toast.error("Error submitting exam.");
      setLoading(false);
    },
  });

  const handleSubmitExam = () => {
    if (isExamSubmitted || loading) return; // Prevent multiple submissions
    clearInterval(timerIdRef.current!); // Clear the timer
    setRemainingTime(0);

    const answeredQuestions = questions?.filter((q) => q.studentAnswer) ?? [];

    if (answeredQuestions.length === 0) {
      toast.error("Please answer at least one question before submitting.");
      return;
    }

    // Construct exam data based on type
    const examData =
      examType === "group-exam"
        ? { examId: id ?? "", answeredExam: answeredQuestions }
        : { studentExamId: id ?? "", answeredTest: answeredQuestions };

    saveRemainingTime(null); // Clear timer from localStorage
    setLoading(true); // Indicate that submission is in progress

    // Submit exam data
    mutation.mutate(examData);
  };

  const runSubmit = (data: IstudentExam) => {
    if (!loading) {
      setLoading(true);
      handleSubmitExam();
    }
  };

  // Update the questions state with the fetched data. This logic is to handle possible errors that may arise from name convention. The getter query object "data.test" has an entry of "options" while the poster object "data.answeredExam" has an entry of "option", this is to transform the options to option so that it doesn't cause conflict in the backend.

  useEffect(() => {
    if (
      data &&
      (examType === "one-on-one-session" ||
        examType === "special-request-session") &&
      Array.isArray(data.questions)
    ) {
      const transformedQuestions = (data?.questions ?? []).map(
        (question: any) => ({
          question: question.question || "",
          answer: question.answer || "",
          studentAnswer: question.studentAnswer || "",
          option: question.options || ["", "", "", ""], // Ensure a default structure
        })
      );
      setQuestions(transformedQuestions);
      setValue("answeredTest", transformedQuestions);
    }
  }, [data, examType, setValue]);

  useEffect(() => {
    if (data && examType === "group-exam" && Array.isArray(data.test)) {
      const transformedQuestions = (data?.test ?? []).map((question: any) => ({
        question: question.question || "",
        answer: question.answer || "",
        studentAnswer: question.studentAnswer || "",
        option: question.options || ["", "", "", ""], // Ensure a default structure
      }));
      setQuestions(transformedQuestions);
      setValue("answeredExam", transformedQuestions);
    }
  }, [data, examType, setValue]);

  const handleCheckboxChange = (qIndex: number, oIndex: number) => {
    if (!questions || questions.length === 0) return; // Prevents undefined errors

    // Use map to create a new array instead of modifying the existing state
    const updatedQuestions = questions.map((q, index) =>
      index === qIndex ? { ...q, studentAnswer: q.option[oIndex] } : q
    );

    const answeredCount = updatedQuestions.filter(
      (q) => q.studentAnswer
    ).length;
    setQuestionsAnswered(answeredCount);
    setQuestions(updatedQuestions); // Ensures state updates correctly

    // Ensure correct exam type is updated
    if (examType === "group-exam") {
      setValue("answeredExam", updatedQuestions, { shouldValidate: true });
    } else {
      setValue("answeredTest", updatedQuestions, { shouldValidate: true });
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentIndex > 0) setCurrentIndex((index) => index - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentIndex < questions.length - 1)
      setCurrentIndex((index) => index + 1);
  };

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "Loading...";
    if (seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins} Minutes:${
      secs < 10 ? "0" : ""
    }${secs} Seconds`;
  };

  if (!id) {
    toast.error("Exam ID is missing.");
    return null;
  }

  return (
    <Container>
      <div className="w-full flex items-center mb-6 justify-between">
        <p className="font-bold text-black">Details</p>
        <Backwards />
      </div>
      {queryLoading ? (
        <p>Loading exam data...</p>
      ) : error ? (
        <p className="text-red-600">{error.message}</p>
      ) : (
        <div className="flex flex-col">
          {/* Rendering the score based on exam submission or time up */}
          {(isExamSubmitted || isTimeUp) && score !== null && (
            <div>
              <p className="text-red-600 font-semibold">
                {isTimeUp && "Time is up!"}
              </p>
              <p className="text-center font-bold">
                You answered {questionsAnswered} out of {questions.length}{" "}
                questions.
              </p>
              {isExamSubmitted && (
                <p className="my-2 font-semibold text-center text-[16px]">
                  Your Score
                </p>
              )}

              <div className="border-2 border-lightGreen flex items-center mx-auto w-[100px] h-[100px] rounded-full p-2">
                <span className="mx-auto text-lg font-bold text-lightGreen">
                  {score}/{questions.length}
                </span>
              </div>
            </div>
          )}
          <form className="w-full flex-5 " onSubmit={handleSubmit(runSubmit)}>
            <div className="flex flex-col w-full md:w-[90%] p-3 md:mx-auto">
              <label className="font-bold text-[20px] pb-3  text-center">
                Answer Your Exams
              </label>
              <p className="text-center text-[15px] my-3 font-bold text-red-600">
                Time Remaining: {formatTime(remainingTime)}
              </p>
              {isTimeUp ? (
                <p className="text-center text-red-600">Time is up!</p>
              ) : (
                questions.length > 0 && (
                  <div className="bg-white p-5 md:mx-auto">
                    {questions.map((q, qIndex) => (
                      <div
                        key={qIndex}
                        className={`${
                          qIndex === currentIndex ? "flex" : "hidden"
                        } flex-col mb-5`}
                      >
                        <label className="font-bold">
                          Question {qIndex + 1}
                        </label>
                        <p className="my-2 p-3 text-[12px] outline-none w-full md:w-[30vh] lg:w-[60vh] bg-[#F8F7F4]">
                          {questions[currentIndex]?.question}
                        </p>
                        <label className="font-bold text-[12px]">Options</label>
                        {Array.isArray(q.option) &&
                          q.option.map((option, oIndex) => (
                            <label
                              key={oIndex}
                              className="flex items-center gap-3"
                            >
                              <span className="my-2 p-3 text-[12px] outline-none w-full md:w-[30vh] lg:w-[55vh] bg-[#F8F7F4]">
                                {option}
                              </span>
                              <input
                                type="checkbox"
                                name="text"
                                checked={q.studentAnswer === option}
                                onChange={() =>
                                  handleCheckboxChange(qIndex, oIndex)
                                }
                                className="appearance-none h-4 w-4 border border-gray-300 rounded-full checked:bg-green-600 checked:border-transparent focus:outline-none"
                              />
                            </label>
                          ))}
                      </div>
                    ))}

                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handlePrev}
                          disabled={
                            currentIndex === 0 || isTimeUp || isExamSubmitted
                          }
                          className="cursor-pointer w-[40px] aspect-square flex items-center justify-center border rounded-md"
                        >
                          <GrFormPrevious />
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          disabled={
                            currentIndex === questions.length - 1 ||
                            isTimeUp ||
                            isExamSubmitted
                          }
                          className="cursor-pointer w-[40px] aspect-square flex items-center justify-center border rounded-md"
                        >
                          <GrFormNext />
                        </button>
                      </div>
                    </div>
                    <Button
                      className="bg-secondary hover:bg-green-800 w-full text-white text-[16px] px-6 py-7 my-5"
                      type="submit"
                      disabled={isTimeUp || isExamSubmitted}
                    >
                      {loading ? "Submitting..." : "Submit Exam"}
                    </Button>
                  </div>
                )
              )}
              {/* {(errors.answeredExam || errors.answeredTest) && (
  <small className="text-red-600">
    Please complete all fields
  </small>
)} */}
            </div>
          </form>
        </div>
      )}
      <ToastContainer />
    </Container>
  );
};

export default StudentExam;
