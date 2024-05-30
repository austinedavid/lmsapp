import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Container from "./Container";
import { Applies } from "@/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { FaQuoteLeft } from "react-icons/fa";
import { MdPlayArrow } from "react-icons/md";


interface Props {
  title: string;
  result: string;
  index: number;
}

const ApplyCard = ({ title, result }: Props) => {
  return (
    <div className="md:w-[180px] w-full text-white  text-center my-3  font-subtext rounded-lg md:ml-16 ml-6  py-3 px-3 md:p-3 flex flex-col justify-center gap-3">
      <div>
        <h2 className="text-base  tracking-wide">{title}</h2>
        <p className="md:text-[30px] text-lg mt-3">{result}</p>
      </div>
    </div>
  );
};

const Apply = () => {
  return (
    <div className="font-subtext bg-stone-100">
      <div className=" bg-black md:h-[80%] h-full">
        <div className="relative  h-full  text-white">
          <Image
            className="w-full h-full  z-0 opacity-40   object-cover"
            src={"/apply_bg.jpg"}
            alt="background"
            width={200}
            height={200}
          />
          <div className="flex flex-col z-10 opacity-100 absolute md:top-[200px]  top-8 md:left-[40px] left-4 justify-between">
            <p className="font-bold w-[144px]  font-header h-[28px] text-dimYellow">
              Join us today
            </p>
            <h3 className="md:text-[40px] md:leading-[42px] text-xl w-[300px] md:w-[668px] font-bold font-subtext">
            Be a smart teacher, Enjoy what you do and earn in six figures!
            </h3>
            <p className="w-[300px] md:w-[668px] font-subtext md:font-[300px] mt-3 leading-[20px] md:leading-[32px]">
              {" "}
              With schooledAfrika, you have access to students who are ready to dive into your world of
              knowledge, right in the comfort of your home at your own scheduled time
            </p>

            <Button
              asChild
              className="hidden bg-lightGreen rounded-lg hover:bg-green-500 text-white text-base mt-3 px-3 w-32  py-2 text-center lg:block"
            >
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="pt-20 pb-6 text-center">
        <h2 className="text-xl md:text-2xl font-header text-lightGreen font-bold">
          {" "}
          <span className="hidden  md:inline-flex w-20 md:w-60 mb-2 py-[.5px]  lgl:w-72 h-[.5px] bg-lightGreen mr-6"></span>
          So Many Reasons to Join Us{" "}
          <span className="hidden md:inline-flex mb-2 w-20 py-[.5px] md:w-60 lgl:w-72 h-[.5px] bg-lightGreen ml-6"></span>
        </h2>
      </div>

      <Container>
        <section className="grid font-subtext  grid-cols-1 sm:px-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 items-center xl:grid-cols-3 gap-6 mt-10">
          <div className="text-center">
            <Image
              alt=""
              src={"/apply-1.png"}
              width={50}
              height={50}
              className="w-1/5 mx-auto"
            />
            <h3 className="text-lg md:text-xl sm:text-xl my-4 font-semibold">
              Teach Your Way
            </h3>

            <p className="my-4 text-base">
            Work at your time and pace. You can work anytime and anywhere, fix
            your target teaching hours per day and work from your comfort zone.

            </p>
          </div>
          <div className="text-center">
            <Image
              alt=""
              src={"/apply-2.png"}
              width={50}
              height={50}
              className="w-1/3 mx-auto"
            />
            <h3 className="md:text-xl text-lg my-4 sm:text-xl font-semibold">
              Get Rewarded
            </h3>

            <p className="my-4 text-base">
            Earn in six figures. Your earnings can be better. Get good pay as a
            teacher.
            </p>
          </div>
          <div className="text-center">
            <Image
              src={"/apply-3.png"}
              width={50}
              height={50}
              alt=""
              className="w-1/5 mx-auto"
            />
            <h3 className="md:text-xl text-lg my-4 sm:text-xl font-semibold">
              Amazing Support
            </h3>

            <p className="my-4 text-base">
            Grow professionally. We help you grow as you stay with us, you
            have access to professional courses that will sharpen your teaching skills and help you
            take more grounds around the world
            </p>
          </div>
        </section>
      </Container>
      <div className="grid mx-auto py-3 shadow-md rounded-md  grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 overflow-hidden bg-lightGreen md:grid-cols-5 items-center lg:grid-cols-5 xl:grid-cols-5  mt-3 lgl:px-10">
        {Applies.map((apply, index) => (
          <ApplyCard key={apply.id} {...apply} index={index} />
        ))}
      </div>

      <div className="py-20 text-center">
        <h2 className="text-2xl font-header text-lightGreen font-bold">
          {" "}
          <span className="hidden  md:inline-flex w-20 md:w-60 mb-2 py-[.5px]  lgl:w-72 h-[.5px] bg-lightGreen mr-6"></span>
          How to Become a Tutor{" "}
          <span className="hidden md:inline-flex mb-2 w-20 py-[.5px] md:w-60 lgl:w-72 h-[.5px] bg-lightGreen ml-6"></span>
        </h2>
      </div>

      <section className="mx-auto max-w-4xl">
        <div
          id=" font-subtext"
          className=" mb-12 flex  flex-col-reverse items-center justify-evenly gap-6 p-6 md:flex-row"
        >
          <div className="md:w-1/3 flex flex-col gap-6 justify-between">
            <div>
              <h3 className="font-bold text-xl mb-2">Complete Registration</h3>
              <p>
              Provide your details and answer all questions correctly{" "}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Create your Subjects</h3>
              <p>
              Set your preferred time and subject and be ready to dive into the world of possibilities.{" "}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Teach and Get Paid</h3>
              <p>
              Get connected with students from any part of the world. Do what you love best and get paid
              doing it. Enjoy !{" "}
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/3 lgl:w-1/3 h-80 relative group">
            <div className="absolute overflow-hidden w-full h-80 left-1 -top-3 rounded-2xl ">
              <div className="w-full  h-full relative z-20 flex pl-6 lgl:pl-0">
                <Image
                  className="rounded-lg  mx-auto h-full w-full object-cover"
                  src={"/apply-woman.jpg"}
                  alt="profileImg"
                  width={200}
                  height={200}
                />
              </div>
            </div>
            <div className=" lgl:inline-flex w-full h-80 border-2 border-lightGreen rounded-md"></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl relative">
        <div
          id=" font-subtext"
          className=" mb-12 flex  flex-col items-center justify-center  gap-6 p-6 md:flex-row-reverse"
        >
          <div className="md:w-1/2 md:translate-x-1/3 flex ml-6 flex-col gap-6 justify-between">
            <div>
              <div className="flex my-4 justify-between text-lightGreen items-center">
                <FaQuoteLeft />
              </div>
              <p>
              Bukola Aleriwa Idowu is a seasoned teacher who believes that the possibilities and
              advantages of technology can help teachers, school and students learn, grow and earn. 
              </p>
              <p className="text-lightGreen text-lg font-semibold my-3">Mrs Bukola</p>
              <p>Founder, SchooledAfrika</p>
            </div>
          </div>

          <div className="hidden  pb-8 md:flex items-end justify-center md:w-[320px]  w-1/3    aspect-square bg-[tomato] rounded-full absolute md:left-3 md:top-6 top-72  left-52 lg:translate-x-1/2">
            <div className="absolute ">
              <Image
                className=" w-[240px]  ml-6"
                src={"/happy-woman.png"}
                alt="heroboy"
                width={100}
                height={100}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="pt-20 pb-6 mt-12 text-center">
        <h2 className="text-xl md:text-2xl font-header text-lightGreen font-bold">
          {" "}
          <span className="hidden  md:inline-flex w-20 md:w-60 mb-2 py-[.5px]  lgl:w-72 h-[.5px] bg-lightGreen mr-6"></span>
          Frequently Asked Questions{" "}
          <span className="hidden md:inline-flex mb-2 w-20 py-[.5px] md:w-60 lgl:w-72 h-[.5px] bg-lightGreen ml-6"></span>
        </h2>
      </div>

  <Accordion type="single" className="md:w-5/6 w-5/6 mx-auto mb-8"  collapsible>
  <AccordionItem className="bg-white border-2 my-2 border-white p-3 rounded-md" value="item-1">
  
  <AccordionTrigger className="text-start inline"> <MdPlayArrow className="inline text-lightGreen text-xl" /> How Much Can I Make From SchooledAfrika?</AccordionTrigger>
    <AccordionContent>
    You can earn six figures in two weeks depending on your periods per day
    </AccordionContent>
  </AccordionItem>
  <AccordionItem className="bg-white border-2 my-2 border-white p-3 rounded-md" value="item-1">
  
  <AccordionTrigger className="text-start inline"> <MdPlayArrow className="inline text-lightGreen text-xl" /> How many periods can I have per day?</AccordionTrigger>
    <AccordionContent>
    This totally depends on your availability and strength .
    </AccordionContent>
  </AccordionItem>
  <AccordionItem className="bg-white border-2 my-2 border-white p-3 rounded-md" value="item-1">
  
  <AccordionTrigger className="text-start inline"> <MdPlayArrow className="inline text-lightGreen text-xl" /> What do i need to be a teacher with schooled Afrika?</AccordionTrigger>
    <AccordionContent>
    Teaching experience
Good teaching skills
Good internet connection
A good phone or laptop
    </AccordionContent>
  </AccordionItem>
  <AccordionItem className="bg-white border-2 my-2 border-white p-3 rounded-md" value="item-1">
  
  <AccordionTrigger className="text-start inline"> <MdPlayArrow className="inline text-lightGreen text-xl" /> When do I get paid?</AccordionTrigger>
    <AccordionContent>
    Every mid Month and end of the month.

    </AccordionContent>
  </AccordionItem>
  <AccordionItem className="bg-white border-2 my-2 border-white p-3 rounded-md" value="item-1">
  
  <AccordionTrigger className="text-start inline"> <MdPlayArrow className="inline text-lightGreen text-xl" /> Will I be invited for an interview before I am accepted?</AccordionTrigger>
    <AccordionContent>
   Yes!
    </AccordionContent>
  </AccordionItem>
</Accordion>


    </div>
  );
};

export default Apply;
