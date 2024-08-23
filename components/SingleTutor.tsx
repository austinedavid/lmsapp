"use client";
import Image from "next/image";
import React, { useState } from "react";
import { MdVerified } from "react-icons/md";
import { FaShareAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import { DialogButton } from "./Dialog";
import { ShareButton } from "./ShareButton";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Container from "./Container";
import Backwards from "./ui/Backwards";
import { ISessionShow } from "./AllTutors";
import { useClasses } from "@/data-access/class";
import { IoIosStar } from "react-icons/io";
import { MdShare } from "react-icons/md";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// this component contains the dialog box to display ratting
const ShowRatting: React.FC<{
  showratting: boolean;
  setShowratting: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ showratting, setShowratting }) => {
  return (
    <Dialog open={showratting} onOpenChange={() => setShowratting(false)}>
      <DialogTrigger className=" w-full" asChild>
        <div className="w-full font-bold  py-3 text-green-800 flex justify-center items-center rounded-lg border border-green-800">
          rate
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]"></DialogContent>
    </Dialog>
  );
};

const ProfileShow: React.FC<{ dp: string; name: string }> = ({ dp, name }) => {
  const [showRatting, setShowratting] = useState<boolean>(false);
  const { status } = useSession();
  const handleRattingShow = () => {
    if (status === "unauthenticated") {
      return toast.error("login to rate this tutor");
    }
    setShowratting(true);
  };
  return (
    <div className=" w-full  bg-white flex flex-col gap-4 py-8 items-center rounded-lg">
      <div className=" w-[200px] h-[200px] rounded-lg overflow-hidden">
        <Image
          src={dp}
          width={200}
          height={200}
          alt=""
          className=" w-full h-full object-cover"
        />
      </div>
      <div className=" flex items-center gap-2">
        <p className=" font-bold text-[20px]">{name}</p>
        <MdVerified className=" text-[20px] text-green-800" />
      </div>
      <div className=" flex flex-col items-center">
        <p className=" text-green-800 font-bold">$10.00-$20.00</p>
        <p>per hour</p>
      </div>
      <div className=" flex flex-col gap-3 items-center w-full">
        <div className=" w-1/3 py-3 bg-green-800 text-white flex items-center justify-center rounded-lg">
          <p>Book a session</p>
        </div>
        <div onClick={handleRattingShow} className=" w-1/3 cursor-pointer">
          <ShowRatting
            showratting={showRatting}
            setShowratting={setShowratting}
          />
        </div>
      </div>
    </div>
  );
};

const Desc: React.FC<{
  name: string;
  desc: string;
  subjects: string[];
  preferences: string[];
  ratting: any;
}> = ({ name, desc, subjects, preferences, ratting }) => {
  const { capitalizeString } = useClasses();
  return (
    <div>
      <div className=" flex flex-col gap-4">
        <p className=" font-bold text-[20px]">About {name}</p>
        <p className=" text-slate-600">{desc}</p>
        <div className=" flex flex-col gap-2">
          <div className=" flex items-center gap-3 font-bold">
            <p>Subjects:</p>
            {subjects.map((subject, index) => (
              <div key={index} className=" flex items-center gap-1 ">
                <Image
                  src={`/${subject.toLowerCase()}.png`}
                  alt=""
                  width={200}
                  height={200}
                  className=" w-[20px] aspect-square"
                />
                <p>{capitalizeString(subject)}</p>
              </div>
            ))}
          </div>
          <div className=" flex items-center gap-3">
            {preferences.map((preference, index) => (
              <div
                className=" text-[12px] px-3 py-2 bg-orange-200 rounded-lg border border-orange-600 text-black"
                key={index}
              >
                <p>{preference}</p>
              </div>
            ))}
          </div>
        </div>
        <Share ratting={ratting} />
      </div>
    </div>
  );
};

const Share: React.FC<{ ratting: any }> = ({ ratting }) => {
  return (
    <div className=" w-full flex items-center justify-between">
      <div className=" flex items-center gap-3">
        <p className=" font-bold text-[20px]">Review</p>
        <div className=" flex items-center gap-1">
          <IoIosStar className=" text-orange-500" />
          {ratting === null ? <p>0</p> : <p>{ratting}</p>}
        </div>
      </div>
      <div className=" flex items-center px-6 py-2 border cursor-pointer border-black w-fit rounded-md gap-1">
        <MdShare />
        <p className=" text-[14px]">Share</p>
      </div>
    </div>
  );
};

const SingleTutor = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { id } = useParams();
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["get-one-session"],
    queryFn: async () => {
      const response = await fetch(
        `/api/apply-for-section/single-section/${id}`
      );
      const result = await response.json();
      return result;
    },
  });
  if (isLoading) {
    return <p>loading...</p>;
  }
  const SingleData: ISessionShow = data;
  return (
    <Container>
      <div className=" w-full mt-16">
        <div className=" w-full flex items-end justify-end">
          <Backwards />
        </div>
        <div className=" flex mt-4 gap-10">
          <div className=" flex-4">
            <ProfileShow
              dp={SingleData.teacher.profilePhoto}
              name={SingleData.teacher.name}
            />
          </div>
          <div className=" flex-6">
            <Desc
              name={SingleData.teacher.name}
              desc={SingleData.teacher.details}
              subjects={SingleData.subjects}
              preferences={SingleData.preference}
              ratting={SingleData.teacher.rating}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </Container>
  );
};

export default SingleTutor;
