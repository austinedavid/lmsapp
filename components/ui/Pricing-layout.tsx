"use client";
import React, { useContext, useState } from "react";
import PricingBtn from "./PricingBtn";
import { eachPrice, monthlyPlans } from "@/constants/pricing/school";
import EachPricing from "../EachPricing";
import { IoCloseSharp } from "react-icons/io5";
import { CommonDashboardContext } from "@/providers/Statecontext";

export interface pricingChange {
  priceAmt: number;
  duration: string;
}
const PricingLayout = () => {
  const [currentIndex, setIndex] = useState<number>(0);
  const { showPricing, setShowPricing } = useContext(CommonDashboardContext);
  const [multiple, setmultiple] = useState<pricingChange>({
    priceAmt: 1,
    duration: "Month",
  });
  const closeModel = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setShowPricing(false);
  };
  return (
    <div
      onClick={closeModel}
      className={` ${
        showPricing ? "flex" : "hidden"
      } px-6 md:px-24 py-3 items-center justify-center fixed top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.4)] z-[999]`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className=" relative scrollbar-hide w-full h-full bg-white rounded-md flex flex-col gap-4 px-6 py-5 overflow-auto"
      >
        <div
          onClick={closeModel}
          className=" absolute top-6 right-3 text-xl cursor-pointer"
        >
          <IoCloseSharp />
        </div>
        <div className=" bg-gray-100 w-fit px-4 py-2 rounded-md flex self-center items-center gap-3">
          <PricingBtn
            setmultiple={setmultiple}
            multipleValue={1}
            duration="Month"
            setIndex={setIndex}
            currentIndex={currentIndex}
            text="Monthly"
            index={0}
          />
          <PricingBtn
            setmultiple={setmultiple}
            duration="Semi year"
            multipleValue={5}
            setIndex={setIndex}
            currentIndex={currentIndex}
            text="Semi-yealy"
            index={1}
          />
          <PricingBtn
            setmultiple={setmultiple}
            duration="Year"
            multipleValue={10}
            setIndex={setIndex}
            currentIndex={currentIndex}
            text="Yearly"
            index={2}
          />
        </div>
        <div>
          <p className=" text-sm font-bold">
            Upgrade and get more out of schooled afrika
          </p>
          <p className=" text-[10px] sm:text-sm font-semibold text-slate-600">
            {" "}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
            nulla
          </p>
        </div>
        <div>
          <hr className=" border" />
          <p className="mt-2 font-bold text-gray-500 text-sm">
            Subscription Bundles
          </p>
        </div>
        <div className=" grid grid-cols-1 xs:2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-5 gap-3">
          {monthlyPlans.map((plan, index) => (
            <EachPricing multiple={multiple} plan={plan} key={index} />
          ))}
        </div>
        <div className=" mt-10 text-green-600 flex justify-center text-sm font-bold cursor-pointer hover:underline">
          <div onClick={closeModel}>No Thank You</div>
        </div>
      </div>
    </div>
  );
};

export default PricingLayout;
