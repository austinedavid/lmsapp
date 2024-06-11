import React from "react";
import Container from "./Container";
import Link from "next/link";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

interface StudentModuleProps {
  onClickButton: () => void;
  onClickBackButton: () => void;
}

const StudentModuleTestOne: React.FC<StudentModuleProps> = ({
  onClickButton,
  onClickBackButton,
}) => {
  const data = ["Option A", "Option B", "Option C", "Option D"];

  return (
    <section>
      <Container>
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[18px]">Module 1 Test</span>
            <span className="text-lightGreen font-bold text-[22px]">24:30</span>
            <div className="flex justify-end mb-2">
              <Link href={"#"}>
                <Button className="bg-transparent text-[#FF6634] border border-[#FF6634] px-8 text-[12px] py-3 my-3 mr-0 md:mr-6">
                  End Test
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex flex-col p-3">
              <label className="font-bold text-center">Question 1</label>
              <Textarea
                className="p-4 resize-none focus:outline-none my-3 w-full h-[50px]"
                placeholder="Your Question here"
              />
              <label className="font-bold text-[12px]">Options</label>
              {data.map((testOptions, index) => (
                <label key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    name={`option${index}`}
                    placeholder={testOptions}
                    className="my-2 p-3 outline-none bg-[#FFFFFF] w-full md:w-[30vh] lg:w-[65vh] bg-[#F8F7F4]"
                  />
                  <input
                    type="radio"
                    name="preferences"
                    className="appearance-none h-4 w-4 border border-gray-300 rounded-full checked:bg-green-600 checked:border-transparent focus:outline-none"
                  />
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-[22%]">
            <div className="flex gap-4">
              <Button
                onClick={onClickBackButton}
                className="bg-[#359C714D] text-white"
              >
                <FaArrowLeft />
              </Button>
              <Button
                onClick={onClickButton}
                className="bg-secondary text-white"
              >
                <FaArrowRight />
              </Button>
            </div>
            <Button
              onClick={onClickButton}
              className="bg-lightGreen text-white text-[16px] px-6 py-2"
            >
              Proceed
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default StudentModuleTestOne;
