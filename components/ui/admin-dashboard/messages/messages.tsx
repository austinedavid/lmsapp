"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useConversion } from "@/data-access/conversion";
import Container from "@/components/Container";
import { Skeleton } from "@mui/material";
import { Noitem } from "@/components/ApplicantsTable";
import ViewMessage from "./ViewMessage";
import RemoveMessage from "./RemoveMessage";

export interface IMessage {
  id: string;
  name: string;
  phoneNo: string;
  email: string;
  message: string;
  createdAt: string;
}

export const ShowSkeleton = () => {
  const myArray = new Array(6).fill(" ");
  return (
    <div className=" w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
      {myArray.map((item, index) => (
        <Skeleton
          key={index}
          className=" w-full rounded-md"
          height={250}
          variant="rectangular"
          animation="wave"
        />
      ))}
    </div>
  );
};

const MessageCard: React.FC<{ item: IMessage }> = ({ item }) => {
  const { makeSubstring } = useConversion();

  const [dialogBox, setDialogBox] = useState<boolean>(false);

  // handle show dialog box
  const showDialogBox = () => {
    setDialogBox((prev) => !prev);
  };
  return (
    <>
      <div className="w-full overflow-hidden font-header rounded-lg card flex flex-col justify-center gap-3 hover:-translate-y-2 transition-transform duration-300 group">
        <div className="relative text-white w-full  my-6">
          <ViewMessage
            id={item.id}
            name={item.name}
            email={item.email}
            phoneNo={item.phoneNo}
            message={item.message}
            showDialogBox={showDialogBox}
            dialogBox={dialogBox}
          />
          <RemoveMessage id={item.id} />
        </div>
        <div className="flex justify-between px-2">
          <p className=" font-bold mt-3 bg-[rgba(0,0,0,0.6)] text-white p-2 rounded-md">
            {makeSubstring(item.name, 10)}
          </p>
          <p className=" font-bold mt-3 text-lightGreen">{item.phoneNo}</p>
        </div>

        <div className="flex flex-col gap-3 mb-8 justify-center mx-4 ">
          <div className=" flex items-center justify-between">
            <div>
              <div className=" flex items-center gap-2">
                <p className="text-[13px] font-bold">{item.email}</p>
              </div>
              <div className=" flex items-center gap-2">
                <p className="text-[14px] font-bold">
                  {" "}
                  {makeSubstring(item.message, 50)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Messages = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getMessage"],
    queryFn: async () => {
      const response = await fetch("/api/get-intouch");
      const result = await response.json();
      return result;
    },
  });

  if (isLoading) {
    return <ShowSkeleton />;
  }
  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <Container>
      {Array.isArray(data) && (
        <div>
          {data.length === 0 ? (
            <div className="w-full">
              <Noitem desc="No new courses" />
            </div>
          ) : (
            <div className="grid mt-8 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 p-4 gap-3">
              {data.map((item: IMessage, index) => (
                <MessageCard item={item} key={index} />
              ))}
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default Messages;
