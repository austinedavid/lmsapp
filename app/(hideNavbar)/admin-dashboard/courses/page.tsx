import React from "react";
import CoursesAdmin from "@/components/ui/admin-dashboard/courses/courses";
import HandleAddCourses from "@/components/ui/admin-dashboard/courses/HandleAddCourses";

const page = () => {
  return (
    <div className="mt-[80px] md:mt-6">
      <div className="flex justify-end mt-6">
        <HandleAddCourses />
      </div>
      <CoursesAdmin />
    </div>
  );
};

export default page;
