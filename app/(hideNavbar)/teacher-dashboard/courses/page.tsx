import React from "react";
import ResourceFeatures from "@/components/ui/teacher-dashboard/ResourceFeatures";
import HandleAddCourses from "@/components/ui/admin-dashboard/courses/HandleAddCourses";

const page = () => {
  return (
    <div className="mt-[80px] md:mt-6">
      <div className="flex justify-end mt-6">
        <HandleAddCourses />
      </div>
      <ResourceFeatures />
    </div>
  );
};

export default page;
