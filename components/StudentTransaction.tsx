import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { MdOutlineContactSupport } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { HandleContactSupport } from "./ui/teacher-dashboard/finances/Card";

const StudentTransaction = () => {
  return (
    <div className="md:flex md:flex-row  gap grid grid-cols-1 justify-between gap-6">
      <div className="flex  flex-6 flex-col">
        <Table className="bg-white overflow-x-auto    rounded-md my-4">
          <TableCaption className="px-3  py-3 rounded-md bg-white">
            <div className="flex font-semibold  justify-between">
              <p>Recent Transactions</p>
            </div>
          </TableCaption>

          <TableHeader>
            <TableRow className="mt-0 text-[12.5px]">
              <TableHead>Name</TableHead>
              <TableHead className="">Type</TableHead>
              <TableHead className="">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="">
              <TableCell className="font-semibold w-[200px] text-[13px] flex  mr-1">
                {/* <Image
                    src=""
                    alt="icon"
                    width={100}
                    height={100}
                    className="w-[30px] h-[30px] mt-2 rounded-md mr-1"
                  />{" "} */}
                <div className="flex ml-1 flex-col">
                  <div className="text-[12px]"></div>
                  <div className="flex justify-between">
                    {/* <p className="text-[10px] py-[2px] px-[10px] rounded-md mr-3 bg-lightGreen text-white">
                        
                      </p> */}
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-[12px] font-semibold"></TableCell>
              <TableCell className="text-[12px] font-semibold"></TableCell>
              <TableCell className="text-[12px] text-lightGreen font-semibold"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <HandleContactSupport />
    </div>
  );
};

export default StudentTransaction;
