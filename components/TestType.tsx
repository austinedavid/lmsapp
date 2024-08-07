import React, { useState } from "react";
import Image from "next/image";
import { IexamZod } from "./TestDetails";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { Subject } from "@/constants/addClassroom";

export interface IExamSubSub {
  register: UseFormRegister<IexamZod>;
  errors: FieldErrors<IexamZod>;
  control: Control<IexamZod>;
  clearErrors: UseFormClearErrors<IexamZod>;
  watch: UseFormWatch<IexamZod>;
  setValue: UseFormSetValue<IexamZod>;
  getValues: UseFormGetValues<IexamZod>;
}
enum Exam {
  MANUAL,
  AUTO,
}
const TestType: React.FC<IExamSubSub> = ({
  register,
  errors,
  clearErrors,
  setValue,
  getValues,
  control,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(() =>
    getValues("type")
  );
  const selectType = (testType: string) => {
    setSelectedOption(testType);
    setValue("type", testType);
    clearErrors("type");
  };

  return (
    <div className="flex flex-col w-full md:w-3/5">
      <label className="font-bold text-[18px]">Set up your Test !</label>
      <div className="flex flex-col">
        <Controller
          control={control}
          name="subject"
          render={({ field }) => (
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                clearErrors("subject");
              }}
            >
              <SelectTrigger className=" w-full py-6">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>

              <SelectContent className=" font-subtext font-medium">
                <ScrollArea className="h-[500px] w-full ">
                  <SelectGroup>
                    {Subject.map((item, index) => (
                      <SelectItem key={index} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </ScrollArea>
              </SelectContent>
            </Select>
          )}
        />
        {errors.subject && (
          <small className="text-red-600">{errors.subject.message}</small>
        )}
      </div>
      <input
        {...register("title")}
        type="text"
        name="title"
        placeholder="Test Title"
        className="my-2 p-4 outline-none rounded-[8px] w-full md:w-[30vh] lg:w-[70vh] bg-white"
        onChange={() => clearErrors("title")}
      />
      {errors.title && (
        <small className=" text-red-600">{errors.title.message}</small>
      )}
      <div id="questionType" className="flex  gap-3 my-2 w-full">
        <div
          onClick={() => selectType("MANUAL")}
          className="bg-[#FFFFFF] p-4 w-full rounded-[5px] cursor-pointer"
        >
          <div className="text-end">
            <input
              className="w-4 h-4 px-2 accent-lightGreen"
              type="radio"
              name="questionType"
              value="typeQuestion"
              checked={selectedOption === "MANUAL"}
            />
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/svgs/type-question.svg"
              width={50}
              height={50}
              alt="Type Question"
            />
            <span className="font-bold text-[10px] md:text-[14px] pb-8 pt-6">
              Type Question Paper
            </span>
          </div>
        </div>
        <div
          onClick={() => selectType("AUTO")}
          className="bg-[#FFFFFF] p-4 w-full rounded-[5px] cursor-pointer"
        >
          <div className="text-end">
            <input
              className="w-4 h-4 px-2 accent-lightGreen"
              type="radio"
              name="questionType"
              value="uploadQuestion"
              checked={selectedOption === "AUTO"}
            />
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/svgs/upload-question.svg"
              width={50}
              height={50}
              alt="Upload Question"
            />
            <span className="font-bold text-[10px] md:text-[14px] pb-8 pt-6">
              Upload Question Paper
            </span>
          </div>
        </div>
      </div>
      {errors.type && (
        <small className=" text-red-600">{errors.type.message}</small>
      )}
    </div>
  );
};

export default TestType;
