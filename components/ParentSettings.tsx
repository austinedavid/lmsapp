"use client";
import React, { useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { teacherProfileSettingsSchema } from "@/constants/teacherProfileSettings";
import { parentPasswordUpdateSchema } from "@/constants/parentPasswordUpdate";
import Image from "next/image";
import { Button } from "./ui/button";
import { toast, ToastContainer } from "react-toastify";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";

import "react-toastify/dist/ReactToastify.css";
import { UpdatePassword, UpdateProfile } from "./TeacherSettings";

export type IupdatingTeacher = z.infer<typeof teacherProfileSettingsSchema>;
export type IupdatingPassword = z.infer<typeof parentPasswordUpdateSchema>;

const ParentSettings = () => {
  return (
    <section className="flex flex-col md:flex-row mt-[100px] md:mt-[30px] gap-4">
      <div className="flex-5 bg-[#FFFFFF] rounded-[5px] p-5 h-[100vh] overflow-y-scroll scrollbar-hide">
        <hr className="my-4" />
        <UpdateProfile />
        <div className="flex flex-col justify-center outline-none rounded-[8px] w-full">
          <div className="my-5">
            <Button className="bg-transparent text-[#359C71] border border-[#359C71] mt-4 font-bold px-2">
              <Image
                src="/svgs/contact-support.svg"
                width={20}
                height={20}
                alt="View Plans"
                className="mr-2"
              />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-4 rounded-[5px]">
        <div>
          <UpdatePassword />
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default ParentSettings;
