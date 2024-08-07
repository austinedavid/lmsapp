import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { FaEllipsisH } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import Link from "next/link";
// import { RemoveTeacher } from "@/components/RemoveTeacher";


export function TeacherOptions() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FaEllipsisH className="ml-3 items-center mb-3" />
      </PopoverTrigger>
      <PopoverContent className="w-40">
        <div className="grid gap-4 font-subtext">
          <div className="grid gap-2">
            <div className="flex justify-start">
              <Link href={`/student-dashboard/teachers/test`}>
                <p className="inline text-[14px]  font-semibold">
                  <GoDotFill className="inline ml-0 text-lightGreen" />
                  Details
                </p>
              </Link>
            </div>
            <hr className="bg-black" />
            {/* <div className="flex justify-start">
              <RemoveTeacher/>
            </div> */}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
