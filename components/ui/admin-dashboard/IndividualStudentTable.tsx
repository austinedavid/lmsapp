import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditStudentDetails from "@/components/ui/admin-dashboard/students/editStudentDetails/editStudentDetails";
import { useConversion } from "@/data-access/conversion";

interface InfoStudent {
  studentData: {
    name: string;
    email: string;
    phoneNo: string;
    birthDate: string;
    gender: string;
    grade: string;
    details: string;
    country: string;
    address: string;
    createdAt: string;
    classes: {
      subject: string;
    };
  };
}

const IndividualStudentTable: React.FC<InfoStudent> = ({ studentData }) => {
   const { handleDate } = useConversion();
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-[25px]">Student Information</p>
          <span>Basic Student Information</span>
        </div>
        <EditStudentDetails />
      </div>
      <>
        <p className="mt-5 bg-gray-200 text-[14px] p-2 rounded">Basics</p>
      </>

      <Table className="bg-white overflow-x-auto rounded-md my-6">
        <TableHeader>
          <TableRow className="text-[14px]">
            <TableHead className="">Full Name</TableHead>
            <TableCell className="font-bold">{studentData.name}</TableCell>
          </TableRow>
          <TableRow className="text-[14px]">
            <TableHead className="">Email</TableHead>
            <TableCell className="font-bold">{studentData.email}</TableCell>
          </TableRow>
          <TableRow className="text-[14px]">
            <TableHead className="">Course</TableHead>
            {studentData.classes.subject}
            <TableCell className="font-bold">UI/UX Adobe</TableCell>
          </TableRow>
          <TableRow className="text-[14px]">
            <TableHead className="">Phone Number</TableHead>
            <TableCell className="font-bold">{studentData.phoneNo}</TableCell>
          </TableRow>
          <TableRow className="text-[14px]">
            <TableHead className="">Gender</TableHead>
            <TableCell className="font-bold">{studentData.gender}</TableCell>
          </TableRow>
          <TableRow className="text-[14px]">
            <TableHead className="">Grade</TableHead>
            <TableCell className="font-bold">{studentData.grade}</TableCell>
          </TableRow>
         
          <TableRow className="text-[14px]">
            <TableHead className="">Joined</TableHead>
            <TableCell className="font-bold"> {handleDate(studentData?.createdAt)}</TableCell>
          </TableRow>
          <TableRow className="text-[14px]">
            <TableHead className="">Address</TableHead>
            <TableCell className="font-bold">{studentData.address}</TableCell>
          </TableRow>
          <TableRow className="text-[14px]">
            <TableHead className="">Details</TableHead>
            <TableCell className="font-bold">{studentData.details}</TableCell>
          </TableRow>
        </TableHeader>
      </Table>
    </div>
  );
};

export default IndividualStudentTable;
