import Hero from "@/components/Hero";
import Offer from "@/components/Offers";
import PopularSubjects from "@/components/PreviewInternalTeachers";
import Virtual from "@/components/Virtual";
import PrivateSession from "@/components/PrivateSession";
import HomeworkSupport from "@/components/HomeworkSupport";
import GetStarted from "@/components/GetStarted";
import Testimonials from "@/components/Testimonials";
import ParentalControl from "@/components/ParentalControl";
import SampleClass from "@/components/SampleClass";
import PreviewInternalTeachers from "@/components/PreviewInternalTeachers";
import SampleCourses from "@/components/SampleCourses";

export default function Home() {
  return (
    <div>
      <Hero />
      <Offer />
      <div className="w-full mt-10 mb-4  flex flex-col items-center">
        <h2 className="text-2xl font-header text-lightGreen font-bold">
          {" "}
          <span className="hidden  md:inline-flex w-20 md:w-60 mb-2 py-[.5px]  lgl:w-72 h-[.5px] bg-lightGreen mr-6"></span>
          How it works{" "}
          <span className="hidden md:inline-flex mb-2 w-20 py-[.5px] md:w-60 lgl:w-72 h-[.5px] bg-lightGreen ml-6"></span>
        </h2>
      </div>
      <Virtual />
      <PrivateSession />
      <HomeworkSupport />
      <ParentalControl />
      {/* <SampleCourses /> */}
      <PreviewInternalTeachers />
      <Testimonials />
      <GetStarted />
    </div>
  );
}
