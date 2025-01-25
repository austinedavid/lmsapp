"use client";
import React, { useState } from "react";
import AddCourses from "./AddCourses";

const HandleAddCourses = () => {
  const [showModel, setShowmodel] = useState<boolean>(false);
  return (
    <div>
      <div onClick={() => setShowmodel(true)}>
        <AddCourses showModel={showModel} setShowmodel={setShowmodel} />
      </div>
    </div>
  );
};

export default HandleAddCourses;
