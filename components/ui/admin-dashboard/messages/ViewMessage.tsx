"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IoMailUnreadOutline } from "react-icons/io5";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { SendSingleMail } from "../teachers/ChangeRole";

interface messageProps {
  id: string;
  name: string;
  phoneNo: string;
  message: string;
  email: string;

  showDialogBox: () => void;
  dialogBox: boolean;
}

const ViewMessage: React.FC<messageProps> = ({
  name,
  email,
  phoneNo,
  message,
  showDialogBox,
  dialogBox,
}) => {
  const [ismailOpen, setismailOpen] = useState<boolean>(false);

  return (
    <div>
      <Dialog open={dialogBox} onOpenChange={() => showDialogBox()}>
        <DialogTrigger asChild>
          <Button className="bg-lightGreen cursor-pointer absolute -translate-y-1/2 left-3 rounded-md text-white text-[12px] font-bold px-4 py-2 text-center lg:block">
            View Message
          </Button>
        </DialogTrigger>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          className="sm:w-[60%] w-[400px] px-3 bg-stone-100 font-subtext"
        >
          <ScrollArea className="h-[200px] w-full px-4 ">
            <div className="grid gap-4 font-header py-4">
              <div className=" w-full flex items-center font-header mb-1 justify-between">
                <p className=" font-bold text-[20px] text-black">
                  Message Overview
                </p>
                <div className="flex justify-start">
                  <div
                    onClick={() => setismailOpen(true)}
                    className=" flex  text-white p-3 rounded-md bg-lightGreen text-[13px] cursor-pointer  font-semibold"
                  >
                    <IoMailUnreadOutline className="inline ml-0 w-4 h-4 mr-2 text-white" />
                    <p>Reply Message</p>
                  </div>
                  <SendSingleMail
                    ismailOpen={ismailOpen}
                    setIsmailOpen={setismailOpen}
                    email={email}
                  />
                </div>
                {/* <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-2 text-dimOrange font-bold border-dimOrange"
                  >
                    Leave
                  </Button>
                </DialogClose> */}
              </div>
              <div className="flex sm:flex-row flex-col justify-between my-1">
                <div className="md:flex-7 relative cursor-pointer">
                  <p className=" text-[16px] font-bold leading-5 py-3">
                    {name}
                  </p>

                  <p className="    text-[14px] font-semibold leading-5 py-3 ">
                    {" "}
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewMessage;
