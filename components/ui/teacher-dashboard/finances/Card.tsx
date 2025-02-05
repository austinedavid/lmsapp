"use client";

import React, { useContext } from "react";
import { CommonDashboardContext } from "@/providers/Statecontext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WithdrawDialog } from "./WithdrawDialog";
import { NotVerified } from "./NotVerified";
import TransactionTable from "@/components/TransactionTable";
import { MdOutlineContactSupport } from "react-icons/md";
import KycCard from "./KycCard";

const Card = () => {
  const { verified, setVerified } = useContext(CommonDashboardContext);

  const handleSendMail = () => {
    return (window.location.href =
      "mailto:info@schooledafrika.com?subject=I need a support&body=hello and good day...");
  };

  return (
    <div className="w-full bg-stone-100">
      {/* Card section */}
      <div className="md:flex md:flex-row  gap grid grid-cols-1 justify-between    gap-6">
        <div className="flex   flex-6 flex-col">
          <div className="flex md:flex-row flex-col gap-6">
            {/* First card */}
            <KycCard />
            {/* second card */}
            <div className="flex flex-3  text-sm  py-3 px-4  justify-between space-x-2  bg-white rounded-md">
              <div className="flex flex-col  justify-evenly">
                <h3 className="font-semibold text-slate-500 text-[13px] pb-2">
                  Withdrawal
                </h3>

                <p className=" text-[11.5px] my-3 font-medium">
                  Your earnings will be sent to the account details provided.
                  Please,confirm your account details before proceeding.
                </p>

                {!verified ? <WithdrawDialog /> : <NotVerified />}
              </div>
            </div>
          </div>
          <div>
            <TransactionTable />
          </div>
        </div>

        {/* Transaction */}
        <div className="space-y-2 font-header">
          <h3 className="font-bold">Need Help ?</h3>
          <p className="text-[13px]">
            Send us a message, we are one click away!
          </p>
          <Button
            asChild
            variant="outline"
            className="border cursor-pointer font-bold border-lightGreen text-lightGreen hover:text-lightGreen"
            onClick={handleSendMail}
          >
            <div>
              {" "}
              <MdOutlineContactSupport className="mr-2 text-[18px]" /> Contact
              Support
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Card;
