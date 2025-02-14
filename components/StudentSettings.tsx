"use client";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { studentProfileSettingsSchema } from "@/constants/studentProfileSettings";
import { studentPasswordUpdateSchema } from "@/constants/studentPasswordUpdate";
import { Button } from "./ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShowUserId } from "./ui/student-dashboard/sessions/OneOnOneSession";
import { IUserInfo, UpdatePassword } from "./TeacherSettings";

export type IupdatingStudent = z.infer<typeof studentProfileSettingsSchema>;
export type IupdatingPassword = z.infer<typeof studentPasswordUpdateSchema>;

const UpdateProfile = () => {
  const [loading, setloading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  // create react hook form
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    getValues,
    control,
    formState: { errors },
  } = useForm<IupdatingStudent>({
    resolver: zodResolver(studentProfileSettingsSchema),
  });
  // fetch the student basic information first
  const { data } = useQuery<IUserInfo>({
    queryKey: ["fetch-student-info"],
    queryFn: async () => {
      const response = await fetch("/api/users-info");
      const result = await response.json();
      return result;
    },
  });
  // useEffect to update the current inputs
  useEffect(() => {
    if (data) {
      setValue("address", data.address);
      setValue("email", data.email);
      setValue("phoneNo", data.phoneNo);
      setValue("name", data.name);
      setValue("gender", data.gender as "Male" | "Female");
    }
  }, [data]);
  //   creating a post using mutation to the backend
  const mutation = useMutation({
    mutationKey: ["updateStudent"],
    mutationFn: async (data: IupdatingStudent) => {
      // console.log(data);
      const result = await fetch("/api/modifyaccount", {
        method: "PUT",
        body: JSON.stringify({
          ...data,
        }),
      });

      return result;
    },
    onSuccess: async (result) => {
      const body = await result.json();
      queryClient.invalidateQueries({ queryKey: ["update"] });
      if (result.ok) {
        setloading(false);
        return toast.success(body.message);
      } else {
        setloading(false);
        return toast.error(body.message);
      }
    },
  });
  // here we validate the datas in our form submission
  // only if there is data, before the mutation function is called
  const runSubmit: SubmitHandler<IupdatingStudent> = async (data) => {
    setloading(true);
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(runSubmit)}>
      <label className="font-bold text-[14px] text-[#9F9F9F]">
        Personal Information
      </label>
      <br />
      {/* input for name and number */}
      <div className=" flex flex-col gap-2">
        <div className="flex gap-[10px] pt-4 max-xs:flex-col">
          <div className=" flex flex-1 flex-col gap-1">
            <input
              id="name"
              {...register("name")}
              name="name"
              type="text"
              className="outline-none p-3 rounded-[5px]  border-2 w-full"
              placeholder="Full Name"
            />
            {errors.name && (
              <small className="text-red-600">{errors.name.message}</small>
            )}
          </div>
          <div className=" flex flex-1 flex-col gap-1">
            <input
              id="phoneNo"
              {...register("phoneNo")}
              name="phoneNo"
              type="text"
              className="outline-none p-3 rounded-[5px] border-2 w-full"
              placeholder="Phone Number"
            />
            {errors.phoneNo && (
              <small className="text-red-600">{errors.phoneNo.message}</small>
            )}
          </div>
        </div>
        <div className="flex gap-[10px]">
          <Controller
            control={control}
            name="grade"
            render={({ field }) => (
              <Select
                value={getValues("grade") && getValues("grade")}
                onValueChange={(value) => {
                  field.onChange(value);
                  clearErrors("grade");
                }}
              >
                <SelectTrigger className=" w-full py-6">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>

                <SelectContent className=" font-subtext font-medium">
                  <ScrollArea className="h-[200px] w-full ">
                    <SelectGroup>
                      <SelectItem value="Grade1">Grade 1</SelectItem>
                      <SelectItem value="Grade2">Grade 2</SelectItem>
                      <SelectItem value="Grade3">Grade 3</SelectItem>
                      <SelectItem value="Grade4">Grade 4</SelectItem>
                      <SelectItem value="Grade5">Grade 5</SelectItem>
                      <SelectItem value="Grade6">Grade 6</SelectItem>
                      <SelectItem value="Grade7">Grade 7</SelectItem>
                      <SelectItem value="Grade8">Grade 8</SelectItem>
                      <SelectItem value="Grade9">Grade 9</SelectItem>
                      <SelectItem value="Grade10">Grade 10</SelectItem>
                      <SelectItem value="Grade11">Grade 11</SelectItem>
                      <SelectItem value="Grade12">Grade 12</SelectItem>
                    </SelectGroup>
                  </ScrollArea>
                </SelectContent>
              </Select>
            )}
          />
          {errors.grade && (
            <small className="text-red-600">{errors.grade.message}</small>
          )}

          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select
                value={getValues("gender") && getValues("gender")}
                onValueChange={(value) => {
                  field.onChange(value);
                  clearErrors("gender");
                }}
              >
                <SelectTrigger className=" w-full py-6">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>

                <SelectContent className=" font-subtext font-medium">
                  <SelectGroup>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.gender && (
            <small className="text-red-600">{errors.gender.message}</small>
          )}
        </div>
        <input
          id="email"
          {...register("email")}
          name="email"
          type="email"
          className="outline-none p-3 mb-4 rounded-[5px] border-2 w-full"
          placeholder="Email Address"
        />
        {errors.email && (
          <small className="text-red-600">{errors.email.message}</small>
        )}
        <hr className="my-4" />
        <label className="font-bold text-[14px] text-[#9F9F9F] my-4">
          Address Details
        </label>
        <input
          id="address"
          {...register("address")}
          name="address"
          type="text"
          className="outline-none p-3 my-4 rounded-[5px] border-2 w-full"
          placeholder="Permanent House Address"
        />
        {errors.address && (
          <small className="text-red-600">{errors.address.message}</small>
        )}
        <hr className="my-4" />
      </div>
      <Button
        type="submit"
        className="bg-secondary w-full text-white text-[16px] py-7 my-3"
        disabled={loading}
      >
        {loading ? "updating profile..." : "Update Profile"}
      </Button>
    </form>
  );
};

const StudentId = () => {
  const { data, isLoading } = useQuery<{ studentId: string }>({
    queryKey: ["get-student-id"],
    queryFn: async () => {
      const response = await fetch("/api/get-student-id");
      const result = await response.json();
      return result;
    },
  });

  if (isLoading) return;
  return data && <ShowUserId userId={data?.studentId} />;
};

const StudentSettings = () => {
  return (
    <section className=" flex flex-col gap-2">
      <div className=" w-full flex items-end justify-end">
        <StudentId />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-5 bg-[#FFFFFF] rounded-[5px] p-5 h-[100vh] overflow-y-scroll scrollbar-hide">
          <UpdateProfile />
        </div>
        <div className="flex-4 rounded-[5px]">
          <UpdatePassword />
          <div></div>
        </div>
        <ToastContainer />
      </div>
    </section>
  );
};

export default StudentSettings;
