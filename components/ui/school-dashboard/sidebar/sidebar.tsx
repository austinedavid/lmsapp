"use client";
import React, { useContext } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { FaPowerOff } from "react-icons/fa";
import { CommonDashboardContext } from "@/providers/Statecontext";
import {
  ParentSideBarComponent,
  SchoolSideBarComponent,
  StudentSideBarComponent,
  TeacherSideBarComponent,
} from "@/components/Sidebars/allSIdebar";
import { signOut } from "next-auth/react";

const Sidebar = ({ dashboard }: { dashboard: string }) => {
  const { showSideBar, setShowSideBar } = useContext(CommonDashboardContext);
  const router = useRouter();
  // function to signout users
  const signOutUser = async () => {
    const logOutData = await signOut({ redirect: false, callbackUrl: "/" });
    router.push(logOutData.url);
  };
  // manipulating the path values
  const path = usePathname().split("/");
  let findpath: string;
  if (path.length === 2) {
    findpath = "";
  } else {
    findpath = path[2];
  }

  return (
    <div className=" flex flex-col gap-12">
      {/* the school logo */}
      <div className=" w-full flex items-center justify-center">
        <Image
          className=" w-[95px] cursor-pointer"
          src="/logo.png"
          alt="logo"
          width={200}
          height={200}
          onClick={() => router.push("/")}
        />
      </div>
      {/* the side bar menu */}
      {
        // if we are in the school dashboard this links should show
        // the null should be replaced with the last dashboard which is the admin dashboard
        dashboard === "school" ? (
          <SchoolSideBarComponent findpath={findpath} />
        ) : dashboard === "teacher" ? (
          <TeacherSideBarComponent findpath={findpath} />
        ) : dashboard === "student" ? (
          <StudentSideBarComponent findpath={findpath} />
        ) : dashboard === "parent" ? (
          <ParentSideBarComponent findpath={findpath} />
        ) : null
      }
      {/* then the last part for log out */}
      <div className="w-full h-[120px] bg-green-800 mt-16  flex items-end justify-center  relative rounded-lg">
        <div className=" w-3/5 h-[120px] left-1/2 rounded-xl transform -translate-x-1/2 bg-white absolute gap-1 -translate-y-1/2 flex flex-col items-center justify-center">
          <Image
            className=" w-[60px] aspect-square rounded-full object-cover"
            src="/tutors.jpg"
            alt="passport"
            width={200}
            height={200}
          />
          <p className=" text-[10px] font-bold">Augustine david</p>
          <p className=" text-[10px] text-[tomato]">Basic plan</p>
        </div>
        <div
          onClick={signOutUser}
          className=" text-white mb-6 flex gap-1 items-center text-[12px] cursor-pointer"
        >
          <p>logout</p>
          <FaPowerOff />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
