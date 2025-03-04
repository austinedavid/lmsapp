import Teachers from "@/components/ui/admin-dashboard/teachers/teachers";
import MailComponent from "@/components/ui/GroupMail";
import React from "react";

const page = () => {
  return (
    <div className="mt-[80px]">
      <MailComponent group="Teachers" />
      <Teachers />
    </div>
  );
};

export default page;
