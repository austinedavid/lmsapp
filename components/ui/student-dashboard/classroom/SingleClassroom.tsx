import Image from "next/image";
import React from "react";
import { FiEdit } from "react-icons/fi";
import { SiGoogleclassroom } from "react-icons/si";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { BsBroadcast } from "react-icons/bs";
import ClassDeals from "./ClassDeals";




const SingleClassroom = () => {
  return (
    <div className="font-header md:mt-6 mt-24">
        <div className="flex justify-between">
            <p className="font-bold text-lg">Details</p>
            <Link href="/student-dashboard/classroom" className="cursor-pointer"> 
            <Image src="/closeAlt.svg" alt="cancel" width={100} height={100} className="w-[20px] h-[20px]"  />
            </Link>
           
           
        </div>
      
      <div className="grid font-subtext md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3 mt-3 mb-2">
        <div className="bg-white py-6 rounded-md">
          <div className="flex justify-between px-6 py-2  pb-1">
            <p className="text-slate-500 text-[14px] mb-3 font-semibold">Overview</p>
             
           
          </div>
          <div className="px-6 flex md:flex-row flex-col  space-x-2 pb-2">
            <Image src="/study.jpg" alt="" width={100} height={100} className="rounded-md md:w-[120px] md:h-[100px] w-full"/>
           
            <div className="">
           
            <p className="inline text-[13px] font-semibold"><SiGoogleclassroom className="inline w-[15px] mr-1 h-[15px]"/>Alpha</p>
            <p className="mt-3 text-[12.5px] font-bold font-header">Grade 12</p>
            </div>
           
          </div>
          <div className="flex px-6 flex-col justify-between">
            <p className="text-[13px] font-semibold">Duration : 45 Minutes</p>
            <p className="text-[13px] my-3 font-semibold">Date Created : April 10th, 2024.</p>

            <Button
            asChild
            className=" bg-dimOrange md:w-36 w-full hover:bg-dimYellow rounded-md text-white text-[13px] mt-3    py-2 px-3 text-center lg:block"
          >
            <Link href="/" className="inline"><BsBroadcast className="inline mr-1" />Join Live Session</Link>
          </Button>
           </div>
        </div>
        <div className="bg-white flex-3 rounded-md py-6 px-6 pb-1 ">
            <p className="text-slate-500 text-[14px] mb-3 font-semibold">Announcements</p>
            <div className="flex items-center space-x-3">
                
                <div className="flex flex-col">
                    <p className="text-[13px] font-bold">All Students</p>
                    <p className="text-[12px]">Lorem ipsum dolor sit amet, consectetuer adipiscing elLorem ipsum dolor sit amet, consectetuer adipiscing</p> 
                   
                </div>
               
            </div> 
            <hr className="w-full mt-3 font-semibold text-black"/>

            <div className="flex items-center space-x-3">
                
                <div className="flex flex-col">
                    <p className="text-[13px] font-bold">All Students</p>
                    <p className="text-[12px]">Lorem ipsum dolor sit amet, consectetuer adipiscing elLorem ipsum dolor sit amet, consectetuer adipiscing</p> 
                   
                </div>
               
            </div> 
            <hr className="w-full my-3 font-semibold text-black"/>
            <div className="flex items-center space-x-3">
                
                <div className="flex flex-col">
                    <p className="text-[13px] font-bold">All Students</p>
                    <p className="text-[12px]">Lorem ipsum dolor sit amet, consectetuer adipiscing elLorem ipsum dolor sit amet, consectetuer adipiscing</p> 
                   
                </div>
               
            </div> 
            <hr className="w-full my-3 font-semibold text-black"/>
            </div>
            <div className="bg-white  rounded-md flex-3 py-6  px-4 ">
        <div className="flex justify-between ">
          <p className="text-slate-500 text-[14px] font-semibold">Schedule</p>
          <Link href="/" className="text-[11.5px] text-lightGreen ">
            View More
          </Link>
        </div>
        <div className="flex my-4 space-x-6 py-2 ">
          <div className="flex flex-col space-y-2">
            <p className="text-[12px] font-semibold">9:00am</p>
            <p className="text-[12px] font-semibold">10:00am</p>
          </div>
          <div className=" border-2 border-lightGreen rounded-full "></div>
          <div className="flex flex-col space-y-2">
            <p className="text-[13px] font-semibold">Mathematics Class</p>
            <p className="text-slate-500 text-[12.5px]">Grade 10</p>
          </div>
        </div>

        <div className="flex my-4 space-x-6 py-2">
          <div className="flex flex-col space-y-2">
            <p className="text-[12px] font-semibold">11:30am</p>
            <p className="text-[12px] font-semibold">12:30pm</p>
          </div>
          <div className=" border-2 border-orange-500 rounded-full "></div>
          <div className="flex flex-col space-y-2">
            <p className="text-[13px] font-semibold">Homework Support</p>
            <p className="text-slate-500 text-[12.5px]">Timi Adewuyi</p>
          </div>
        </div>

        <div className="flex my-4 space-x-6">
          <div className="flex flex-col space-y-2 ml-1">
            <p className="text-[12px] font-semibold">2:00pm</p>
            <p className="text-[12px] font-semibold">3:00pm</p>
          </div>
          <div className=" border-2 border-amber-500 rounded-full "></div>
          <div className="flex flex-col space-y-2">
            <p className="text-[13px] font-semibold">Mathematics Class</p>
            <p className="text-slate-500 text-[12.5px]">Grade 11</p>
          </div>
        </div>
      </div>
       
      </div>
      <ClassDeals/>
    </div>
  );
};

export default SingleClassroom;
