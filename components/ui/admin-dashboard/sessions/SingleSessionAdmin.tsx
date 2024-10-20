"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { IOffers, StudentTeacherInfo } from "./Sessions";
import Image from "next/image";
import { useConversion } from "@/data-access/conversion";
import { MdStarRate } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { IoIosCheckmark } from "react-icons/io";
import { CircularProgress, Skeleton } from "@mui/material";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TiWarning } from "react-icons/ti";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { CgProfile } from "react-icons/cg";

interface ITeacherInfo {
  teacher: StudentTeacherInfo;
  sesionId: string;
}

interface IAllViews {
  id: string;
  sessionId: string;
  teacher: {
    name: string;
    profilePhoto: string;
    gender: string;
    ratting?: number;
  };
}

// the dialog box which will handle merging of teacher to student
// this dailog handles confirmation
export const Approval: React.FC<{
  auto: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dialogOpen: boolean;
  selectedId: string;
}> = ({ auto, setDialogOpen, dialogOpen, selectedId }) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [amt, setAmt] = useState<string | null>(null);
  const { id } = useParams();
  const queryclient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["merge-session"],
    mutationFn: async () => {
      const response = await fetch("/api/session-view", {
        method: "PUT",
        body: JSON.stringify({
          amt,
          adminSessionId: id,
          teacherSessionId: selectedId,
        }),
      });
      return response;
    },
    onSuccess: async (response) => {
      const result = await response.json();
      if (response.status === 200) {
        toast.success(result.message);
        setDialogOpen(false);
        setTimeout(() => {
          queryclient.invalidateQueries({ queryKey: ["session-single"] });
        }, 3000);
        return;
      }
      setSubmitting(false);
      return toast.error(result.message);
    },
  });
  // below here we perform submitting the action to backend
  const handleApprove = () => {
    if (submitting) return;
    if (!amt) return alert("please enter amount to proceed");
    setSubmitting(true);
    mutation.mutate();
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(false)}>
      <DialogTrigger>
        <button
          className={` flex-2 ${
            auto ? " px-4 py-2" : "px-2 py-1"
          } bg-green-700 text-white rounded-md text-[12px] `}
        >
          Merge
        </button>
      </DialogTrigger>
      <DialogContent
        className=" w-4/5 md:w-2/5 rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" w-full flex flex-col gap-3">
          <div className=" flex items-center flex-col">
            <TiWarning className=" text-[60px] text-[tomato]" />
            <p className=" font-semibold text-[18px] text-slate-600">
              Are you sure about merging this session
            </p>
          </div>
          <div className=" flex items-center justify-center flex-col">
            <input
              onChange={(e) => setAmt(e.target.value)}
              className=" w-1/2 border py-2 px-2"
              placeholder="enter amount"
              type="number"
            />
          </div>
          <div className=" flex flex-col gap-3">
            <div
              onClick={handleApprove}
              className=" w-full py-3 flex items-center justify-center bg-green-700 text-white rounded-md cursor-pointer transition-all duration-700 ease-in-out hover:bg-green-600 "
            >
              {submitting ? <p>Merging now...</p> : <p>Aprrove Merge</p>}
            </div>
            <div
              onClick={() => setDialogOpen(false)}
              className="  w-full py-3 flex items-center justify-center bg-red-700 text-white rounded-md cursor-pointer transition-all duration-700 ease-in-out hover:bg-red-600"
            >
              <p>Cancel</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// component to render teacher basic info
const ShowTeacher: React.FC<{ details: ITeacherInfo }> = ({ details }) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  console.log(details.teacher.rating);
  return (
    <div>
      <div className=" w-full flex items-center justify-center mt-3">
        <p className=" text-[14px]">
          Session profile that was selected during booking
        </p>
      </div>
      <div className=" w-full mt-5 flex flex-col items-center justify-center">
        <Image
          src={details?.teacher.profilePhoto!}
          alt="teacherDP"
          width={200}
          height={200}
          className=" w-[80px] aspect-square rounded-full"
        />
        <p className=" text-black font-bold">{details?.teacher.email}</p>
        <p className=" text-black font-bold">{details?.teacher.name}</p>
        <div className=" flex items-center">
          <MdStarRate className=" text-[tomato]" />
          {details.teacher.rating === null ? (
            <p>0</p>
          ) : (
            <p>{details?.teacher.rating}</p>
          )}
        </div>
        <div className=" mt-4">
          <div onClick={() => setDialogOpen(true)}>
            <Approval
              selectedId={details.sesionId}
              setDialogOpen={setDialogOpen}
              dialogOpen={dialogOpen}
              auto={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// list of all the session profile that can be merged
const ShowAllSessionProfile = () => {
  const [filterStr, setFilterStr] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  //   function to handle filtering here
  const filteredTeacher = (allItem: IAllViews[]): IAllViews[] => {
    const filtered = allItem.filter((item) =>
      item.sessionId.toLowerCase().includes(filterStr.toLowerCase())
    );
    return filtered;
  };
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["get-all-session-profile"],
    queryFn: async () => {
      const response = await fetch("/api/session-view/all-session-profiles");
      const result = await response.json();
      return result;
    },
  });

  if (isFetching) {
    return (
      <div className=" w-full h-[450px] flex items-center justify-center">
        <CircularProgress color="success" size={50} />
      </div>
    );
  }

  if (isError) {
    return <p>{error.message}</p>;
  }
  const AllTeachers: IAllViews[] = data;
  return (
    <div className=" mt-4 max-h-[400px] overflow-y-auto w-full">
      <div className=" w-full flex items-center justify-center text-[14px]">
        <p>Merge from list of Session Profiles</p>
      </div>
      <div className=" w-[70%] px-2 py-2 flex items-center border rounded-md bg-white">
        <div className=" flex-1 text-[22px] text-gray-400">
          <IoSearchSharp />
        </div>
        <input
          className=" flex-8 outline-none bg-transparent"
          placeholder="search by sessionId"
          onChange={(e) => setFilterStr(e.target.value)}
        />
      </div>
      {/* list of the teachers below here */}
      <div className=" ">
        {Array.isArray(filteredTeacher(AllTeachers)) && (
          <div>
            {
              filteredTeacher(AllTeachers).length === 0 ? (
                <div className=" mt-4 flex items-center justify-center">
                  <p className=" text-slate-500 font-bold">No match found</p>
                </div>
              ) : (
                <div className=" flex flex-col gap-1 mt-3">
                  {filteredTeacher(AllTeachers).map((teacher, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedId(teacher?.sessionId!)}
                      className=" w-full px-2 py-1 flex border rounded-md cursor-pointer hover:bg-slate-300"
                    >
                      <div className=" flex-8 flex gap-2 items-center">
                        <div
                          className={` w-[30px] aspect-square rounded-sm flex items-center justify-center ${
                            selectedId === teacher?.sessionId
                              ? "bg-green-700 text-white"
                              : " bg-slate-400 text-black"
                          }`}
                        >
                          <IoIosCheckmark />
                        </div>
                        <Image
                          src={teacher?.teacher.profilePhoto}
                          alt="profileDp"
                          width={200}
                          height={200}
                          className=" w-[30px] aspect-square rounded-full "
                        />
                        <p className=" text-[14px] font-semibold text-gray-600">
                          {teacher?.teacher.name}
                        </p>
                      </div>
                      {selectedId === teacher?.sessionId && (
                        <div onClick={() => setDialogOpen(true)}>
                          <Approval
                            selectedId={selectedId}
                            dialogOpen={dialogOpen}
                            setDialogOpen={setDialogOpen}
                            auto={false}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) //the last div here
            }
          </div>
        )}
      </div>
    </div>
  );
};

// componet for teachers to merge
const TeachersToMerge: React.FC<{ infos: ITeacherInfo }> = ({ infos }) => {
  const [sessionTeacher, setSessionTeacher] = useState<boolean>(true);
  return (
    <div>
      {/* button to toggle type of merging here */}
      <div className=" w-full flex h-[40px]">
        <div
          onClick={() => setSessionTeacher(true)}
          className={` cursor-pointer font-semibold text-[14px] flex-1 h-full items-center justify-center flex rounded-bl-md rounded-tl-md ${
            sessionTeacher
              ? "bg-green-700 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          <p>Auto Merge</p>
        </div>
        <div
          onClick={() => setSessionTeacher(false)}
          className={` font-semibold text-[14px] cursor-pointer flex-1 h-full rounded-tr-md items-center justify-center flex rounded-br-md ${
            sessionTeacher
              ? "bg-gray-200 text-gray-500"
              : "bg-green-700 text-white"
          }`}
        >
          <p>Merge From List</p>
        </div>
      </div>
      {/* display component based on the selected */}
      {sessionTeacher ? (
        <ShowTeacher details={infos} />
      ) : (
        <ShowAllSessionProfile />
      )}
    </div>
  );
};

// single row without array
export const SingleRowNoArray: React.FC<{
  name: string;
  value: string | number | boolean;
  payment?: boolean;
}> = ({ name, value, payment }) => {
  return (
    <div className=" flex gap-2 items-start text-[14px]">
      <p className=" font-semibold">{name}:</p>
      <p className={`${name == "AMT" && " text-green-800 font-semibold"} `}>
        {value}
      </p>
    </div>
  );
};
export const SingleRowPayment: React.FC<{
  name: string;
  value: boolean;
}> = ({ name, value }) => {
  console.log("show value here", value);
  return (
    <div className=" flex gap-2 items-center text-[14px]">
      <p className=" font-semibold">{name}:</p>
      <p
        className={`${
          value ? "text-green-800 font-bold" : " text-red-700 font-bold"
        } `}
      >
        {String(value)}
      </p>
    </div>
  );
};

// single row with array
export const SingleRowWithArray: React.FC<{
  name: string;
  value: string[];
  payment?: boolean;
}> = ({ name, value, payment }) => {
  const joined = value?.join(",");

  return (
    <div className=" flex gap-2 items-start text-[14px]">
      <p className=" font-semibold">{name}:</p>
      <p
        className={`${name == "AMT" && " text-green-800 font-semibold"} ${
          payment && " text-green-800 font-bold"
        }`}
      >
        {joined?.toLowerCase()}
      </p>
    </div>
  );
};

// component for students info
const StudentInfos: React.FC<{ infos: IOffers }> = ({ infos }) => {
  console.log("this is the show", infos.student.profilePhoto);
  const { handleDate } = useConversion();
  return (
    <div className=" bg-white py-3 px-2 rounded-md">
      <div className=" w-full flex items-center flex-col border-b pb-3">
        {infos.student.profilePhoto === null ? (
          <div className=" w-[80px] aspect-square rounded-full border flex items-center justify-center text-[40px]">
            <CgProfile />
          </div>
        ) : (
          <Image
            src={infos?.student.profilePhoto!}
            alt="studentpic"
            width={200}
            height={200}
            className=" w-[80px] aspect-square rounded-full"
          />
        )}
        <p className=" text-[14px] font-semibold">{infos?.student.email}</p>
        <p className=" text-[14px] font-semibold">{infos?.student.name}</p>
      </div>
      {/* the remaining part of the card below here */}
      <div className=" flex flex-col gap-1 pt-2">
        <div className=" w-full flex items-center justify-center">
          <div className=" px-4 py-2 text-[12px] bg-green-700 text-white rounded-md">
            <p>{infos?.sectionType}</p>
          </div>
        </div>
        <SingleRowNoArray name="Curriculum" value={infos?.curriculum} />
        <SingleRowNoArray name="Grade" value={infos?.grade} />
        <SingleRowNoArray
          name="Hours/day"
          value={infos?.hoursperday + " " + "hours"}
        />
        <SingleRowNoArray
          name="Created Date"
          value={handleDate(infos?.createdAt)}
        />
        <SingleRowNoArray
          name="Start Time"
          value={handleDate(infos?.startTime)}
        />
        <SingleRowNoArray name="Goals" value={infos?.learningGoal} />
        <SingleRowNoArray name="AMT" value={"$" + infos?.amt} />
        <SingleRowPayment name="Merged" value={infos?.merged} />
        <SingleRowNoArray name="Duration" value={infos?.duration} />
        <SingleRowWithArray name="Days" value={infos?.learningDays} />
        <SingleRowWithArray name="SpecialNeed" value={infos?.specialNeed} />
      </div>
    </div>
  );
};

// loading for the page
const LoadingSkeleton = () => {
  return (
    <div>
      <div className=" w-full flex items-center justify-center">
        <p className=" mb-4 text-black font-bold text-[24px]">
          Single unmerged session
        </p>
      </div>
      <div className=" w-full md:px-20">
        <div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-3 border-2 px-4 py-2 rounded-md shadow-md ">
          <Skeleton
            variant="rectangular"
            height={400}
            className=" w-full rounded-md"
          />
          <Skeleton
            variant="rectangular"
            height={400}
            className=" w-full rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

// the main component for this single session page
const SingleSessionAdmin = () => {
  const { id } = useParams();
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["session-single"],
    queryFn: async () => {
      const response = await fetch(
        `/api/session-view/single-session?sessionId=${id}`
      );
      const result = await response.json();
      return result;
    },
  });
  // return loading if is loading
  if (isFetching) {
    return <LoadingSkeleton />;
  }
  // return error if is error
  if (isError) {
    return <p>{error.message}</p>;
  }
  const singleSession: IOffers = data;
  return (
    <div>
      <div className=" w-full flex items-center justify-center">
        <p className=" mb-4 text-black font-bold text-[24px]">
          Single unmerged session
        </p>
      </div>
      <div className=" w-full md:px-20">
        <div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-3 border-2 px-4 py-2 rounded-md shadow-md ">
          <StudentInfos infos={singleSession} />
          <TeachersToMerge infos={singleSession.sectionInfo} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SingleSessionAdmin;
