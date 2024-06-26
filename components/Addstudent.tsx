import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { LiaGraduationCapSolid } from "react-icons/lia";

function AddStudent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-lightGreen bg-none border-none rounded-lg hover:bg-green-700  text-white text-[14px] font-bold  px-3 sm:w-36 w-28  py-2 text-start lg:block">
          <LiaGraduationCapSolid className="sm:inline-block text-lg hidden mr-1" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] font-subtext">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Add Student</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 font-header py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="id"
              type="text"
              placeholder="Student ID"
              className="col-span-6 w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-6 bg-lightGreen hover:bg-green-700"
          >
            Send Invite
          </Button>
          <div className="w-full flex flex-col items-center">
            <h2 className="text-lg  text-black font-bold">
              {" "}
              <span className="hidden  md:inline-flex w-20 md:w-36 mb-2 py-[.3px]  lgl:w-72 h-[.3px] bg-slate-700 mr-6"></span>
              OR{" "}
              <span className="hidden md:inline-flex mb-2 w-20 py-[.3px] md:w-32 lgl:w-72 h-[.3px] bg-slate-700 ml-6"></span>
            </h2>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="email"
              placeholder="Email Address"
              className="col-span-6 w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="w-full py-6 bg-lightGreen hover:bg-green-700"
          >
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddStudent;
