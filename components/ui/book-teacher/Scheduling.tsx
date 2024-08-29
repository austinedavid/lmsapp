"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { FaHourglassStart, FaHourglassEnd } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ISessionSub } from "./ChildDetails";
import { Controller } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface SessionTypes {
  id: number;
  sessionName: string;
  price: number;
  billingCycle: string;
}

const Scheduling: React.FC<ISessionSub> = ({
  register,
  errors,
  control,
  watch,
  clearErrors,
  setValue,
}) => {
  const SessionTypes: SessionTypes[] = [
    {
      id: 1,
      sessionName: "Homework Support",
      price: 240,
      billingCycle: "yearly",
    },
    {
      id: 2,
      sessionName: "Private Session",
      price: 72,
      billingCycle: "yearly",
    },
  ];

  const [days, setDays] = React.useState<string[]>([]);
  const [sessionTypes, setSessionTypes] = React.useState<SessionTypes>();
  const [hours, setHours] = React.useState<number>(1);
  const [length, setLength] = React.useState<"monthly" | "yearly">("monthly");

  // Calculate the monthly price of the selected item
  const calculateMonthlyPrice = (): number => {
    if (!sessionTypes) return 0;

    let pricePerMonth = sessionTypes.price;

    // Convert yearly price to monthly if necessary
    if (sessionTypes.billingCycle === "yearly" && length === "monthly") {
      pricePerMonth = sessionTypes.price / 12;
    }

    return pricePerMonth * hours;
  };

  // Handle session selection
  const handleSessionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sessionTypeId = Number(event.target.value);
    const sessionType = SessionTypes.find((s) => s.id === sessionTypeId);
    setSessionTypes(sessionType);
    if (!sessionType) return;
    setValue("sessionTypes", sessionType);
    setHours(1); // Reset hours when changing session
  };

  // Handle hours change
  const handleHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHour = Number(event.target.valueAsNumber);
    setHours(newHour);
  };

  // Handle billing period change
  const handleBillingPeriodChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newBillingPeriod = event.target.value as "monthly" | "yearly";
    setLength(newBillingPeriod);
  };
  const Days = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  // this function below handle session selection
  const handleDays = (item: string) => {
    // checking if the preference is already in the array
    // if there remove, else add it
    let arrayInstance = [...days];
    const checkDays = arrayInstance.find((value) => value === item);
    if (checkDays) {
      const removedDays = arrayInstance.filter((value) => value !== item);
      arrayInstance = [...removedDays];
      setDays(removedDays);
      setValue("days", arrayInstance);
      clearErrors("days");
    } else {
      arrayInstance.push(item);
      setDays(arrayInstance);
      setValue("days", arrayInstance);
      clearErrors("days");
    }
  };

  return (
    <div className="">
      <div className="flex space-x-32 md:justify-between">
        <h3 className="text-xl font-bold">Book Session</h3>
      </div>
      <ScrollArea className="min-h-[500px] md:w-full ">
        <div className="flex  mt-2 mb-6  flex-col gap-3">
          <p className=" font-semibold text-lightGreen">Scheduling</p>
          <p className="text-[14px] font-semibold">Confirm Class Schedule</p>
        </div>

        <div className="border  px-3  py-2 mt-6  rounded-md gap-[10px]">
          <label className="font-bold text-[16px]">Select Day(s)</label>
          <div className="grid grid-cols-2 gap-x-2 w-full">
            {Days.map((Day, index) => (
              <label
                onClick={() => handleDays(Day)}
                key={index}
                className="flex justify-between items-center text-[13px] font-semibold gap-2 my-2 px-4 py-3 outline-none rounded-[8px] bg-white cursor-pointer"
              >
                {Day}
                <input
                  type="checkbox"
                  name="days"
                  checked={days.includes(Day)}
                  value={Day}
                  className="appearance-none h-4 w-4 border border-gray-300 rounded-full checked:bg-green-600 checked:border-transparent focus:outline-none"
                />
              </label>
            ))}
          </div>

          {errors.days && (
            <small className=" text-red-600">{errors.days.message}</small>
          )}
        </div>

        {/* Session selection */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-x-2 w-full border  px-3  py-2  rounded-md gap-[10px]">
          <div>
            <label htmlFor="sessionType" className="font-bold text-[16px]">
              Select Session:
            </label>
            <br />

            <select
              id="sessionTypes"
              name="sessionTypes"
              className="p-3 font-medium rounded-md text-[14px]"
              onChange={handleSessionChange}
              value={sessionTypes?.id || ""}
            >
              <option value="" selected disabled>
                Select a Session
              </option>
              {SessionTypes.map((sessionType) => (
                <option key={sessionType.id} value={sessionType.id}>
                  {sessionType.sessionName}
                </option>
              ))}
            </select>
            {/* {console.log(sessionTypes)} */}
            {errors.sessionTypes && (
              <small className="text-red-600">
                {errors.sessionTypes.message}
              </small>
            )}
          </div>

          {/* Hours input */}
          <div className="bg-white  rounded-md text-[14px] font-medium md:text-center pl-3 py-2 space-x-2">
            <label>Hours per day:</label>
            <input
              {...register("hours")}
              name="hours"
              type="number"
              onChange={handleHoursChange}
            />

            {errors.hours && (
              <small className="text-red-600">{errors.hours.message}</small>
            )}
          </div>

          {/* Billing period selection */}
          <div className="bg-white  rounded-md text-[14px] font-medium  pl-3 ">
            <label htmlFor="length">Billing Period:</label>
            <select
              id="length"
              {...register("length")}
              name="length"
              className="p-3 font-medium rounded-md text-[14px]"
              onChange={handleBillingPeriodChange}
              value={length}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <br />
            {errors.length && (
              <small className="text-red-600">{errors.length.message}</small>
            )}
          </div>
        </div>

        <div className="flex  border   justify-between px-3  py-2  rounded-md gap-[10px]">
          <Controller
            control={control}
            name="times"
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  clearErrors("times");
                }}
              >
                <SelectTrigger className=" w-full py-6">
                  <SelectValue placeholder="From what time?" />
                </SelectTrigger>

                <SelectContent className=" font-subtext font-medium">
                  <ScrollArea className="h-[200px] w-full ">
                    <SelectGroup>
                      <SelectItem value="one">1:00</SelectItem>
                      <SelectItem value="two">2:00</SelectItem>
                      <SelectItem value="three">3:00</SelectItem>
                      <SelectItem value="four">4:00</SelectItem>
                      <SelectItem value="five">5:00</SelectItem>
                      <SelectItem value="six">6:00</SelectItem>
                      <SelectItem value="seven">7:00</SelectItem>
                      <SelectItem value="eight">8:00</SelectItem>
                      <SelectItem value="nine">9:00</SelectItem>
                      <SelectItem value="ten">10:00</SelectItem>
                      <SelectItem value="eleven">11:00</SelectItem>
                      <SelectItem value="twelve">12:00</SelectItem>
                      <SelectItem value="thirteen">13:00</SelectItem>
                      <SelectItem value="fourteen">14:00</SelectItem>
                      <SelectItem value="fifteen">15:00</SelectItem>
                      <SelectItem value="sixteen">16:00</SelectItem>
                      <SelectItem value="seventeen">17:00</SelectItem>
                      <SelectItem value="eighteen">18:00</SelectItem>
                      <SelectItem value="nineteen">19:00</SelectItem>
                      <SelectItem value="twenty">20:00</SelectItem>
                    </SelectGroup>
                  </ScrollArea>
                </SelectContent>
              </Select>
            )}
          />

          {errors.times && (
            <small className="text-red-600">{errors.times.message}</small>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2  border px-3  py-2  rounded-md gap-[10px]">
          <Controller
            control={control}
            name="classStarts"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full p-4 py-6 justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <FaHourglassStart className="mr-2 h-4 text-lightGreen w-4" />
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>When do you want to begin?</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full col-span-6 p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onDayClick={field.onChange}
                    className="font-subtext"
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />

          {errors.classStarts && (
            <small className=" text-red-600">
              {errors.classStarts.message}
            </small>
          )}
        </div>

        {/* Display price */}
        <div className="my-2 font-semibold text-center text-[14px]">
          <h2>
            Total Price:{" "}
            <span className="font-bold text-[18px]">
              ${calculateMonthlyPrice().toFixed(2)}
            </span>{" "}
          </h2>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Scheduling;
