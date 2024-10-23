import React from "react";
import Classroom from "@/components/ui/teacher-dashboard/classroom/classroom";
import DashboardPagination from "@/components/DashboardPagination";
import HandleAddClass from "@/components/HandleAddClass";

const page = () => {
  return (
    <div className="mt-[80px] md:mt-6">
      <div className="flex justify-end mt-6">
        <HandleAddClass />
      </div>
      <Classroom />
      <DashboardPagination />
    </div>
  );
};

export default page;
