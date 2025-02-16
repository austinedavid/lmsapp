"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import TransactionTable from "@/components/TransactionTable";
import { MdOutlineContactSupport } from "react-icons/md";
import AccountInfo from "./KycCard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const HandleContactSupport = () => {
  const handleSendMail = () => {
    return (window.location.href =
      "mailto:info@schooledafrika.com?subject=I need a support&body=hello and good day...");
  };
  return (
    <div className="space-y-2 font-header">
      <h3 className="font-bold">Need Help ?</h3>
      <p className="text-[13px]">Send us a message, we are one click away!</p>
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
  );
};

const FinCard = () => {
  return (
    <div className="w-full bg-stone-100">
      {/* Card section */}
      <div className="md:flex md:flex-row  gap grid grid-cols-1 justify-between    gap-6">
        <div className="flex   flex-6 flex-col">
          <div className="flex md:flex-row flex-col gap-6">
            <AccountInfo />
          </div>
          <div>
            <TransactionTable text="All Transactions" brief={false} />
          </div>
        </div>

        {/* Transaction */}
        <HandleContactSupport />
      </div>
      <ToastContainer />
    </div>
  );
};

export default FinCard;
