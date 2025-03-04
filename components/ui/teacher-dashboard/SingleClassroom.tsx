"use client";
import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { SiGoogleclassroom } from "react-icons/si";
import Link from "next/link";
import SingleClassTable from "./SingleClassTable";
import { useParams } from "next/navigation";
import { useConversion } from "@/data-access/conversion";
import { useToast } from "@/components/ui/use-toast";
import { SingleClassSkeleton } from "@/components/SingleClassroom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEllipsisH, FaRegEdit } from "react-icons/fa";
import { Input } from "../input";
import { Trash2 } from "lucide-react";
import { Button } from "../button";
import {
  AddClassLink,
  AddMettingModel,
  JoinClassLink,
} from "../student-dashboard/sessions/OneOnOneSession";
import { CircularProgress } from "@mui/material";

interface studentProps {
  studentIds: string[];
}
interface Announcement {
  id: string;
  title: string;
  desc: string;
  classesId: string;
  createdAt: string;
  viewedBy: string[];
}

interface IndividualAnnouncementProps {
  dataId: string;
  title: string;
  content: string;
  isTeacher: boolean;
  viewedBy: string[];
}

interface EditAnnouncementProps {
  dataId: string;
  title: string;
  content: string;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dialogueOpen: boolean;
}

interface RemoveAnnouncementProps {
  dataId: string;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dialogueOpen: boolean;
}

interface AnnouncementsListProps {
  announcements: Announcement[];
  isTeacher: boolean;
  handleShowMore: () => void;
  handleShowLess: () => void;
  isExpanded: boolean;
  visibleItems: number;
  handleDate: (date: string) => string;
}

interface SingleClassInterface {
  id: string;
  subject: string;
  className: string;
  grade: string;
  duration: string;
  classStarts: string;
  classEnds: string;
  schedules: string[];
  price: number;
  classBanner: string;
  classTime: string;
  teacherId: string;
  studentIDs: string[];
  maxCapacity: number;
  currentCapacity: number;
  resourcesIds: string[];
  createdAt: string;
  updatedAt: string;
  students: [];
  AnnouncementByTeacherClass: Announcement[];
  ClasssMeetingLink: {
    id: string;
    link: string;
    classesId: string;
    createdAt: string;
  };
}

export const AnnouncementsList: React.FC<AnnouncementsListProps> = ({
  announcements,
  isTeacher,
  handleShowMore,
  handleShowLess,
  isExpanded,
  visibleItems,
  handleDate,
}) => {
  const { makeSubstring } = useConversion();
  const { data } = useSession();
  return (
    <div
      className={`announcement-container bg-white px-4 py-2 rounded-md ${
        isExpanded ? "announcement-expanded" : ""
      }`}
    >
      <p className="text-slate-500 text-[14px] mb-3 font-semibold">
        Announcements
      </p>

      {announcements?.length > 0 ? (
        <>
          {announcements.slice(0, visibleItems).map((announcement) => (
            <div key={announcement.id} className="mt-3 relative">
              <div className="flex justify-between">
                <p className="text-[13px] font-bold">
                  {makeSubstring(announcement.title, 10)}
                </p>
                {/* Show edit and delete options only if the user is a teacher */}
                <IndividualAnnouncement
                  dataId={announcement.id}
                  title={announcement.title}
                  content={announcement.desc}
                  isTeacher={isTeacher}
                  viewedBy={announcement.viewedBy}
                />
              </div>
              <p className="text-[12px]">
                {makeSubstring(announcement.desc, 100)}
              </p>
              <p className="text-[10px] text-slate-500">
                Posted on: {handleDate(announcement.createdAt)}
              </p>
              {!isTeacher &&
                !announcement.viewedBy.includes(data?.user.id!) && (
                  <div className=" w-3 aspect-square rounded-full bg-green-800 absolute right-2 bottom-2"></div>
                )}
              <hr className="w-full my-3 font-semibold text-black" />
            </div>
          ))}

          {/* Show More / Less Button */}
          {announcements.length > 2 && (
            <div className="flex justify-center mt-4">
              {isExpanded ? (
                <button
                  onClick={handleShowLess}
                  className="text-white w-full rounded-md p-2 text-[14px] bg-lightGreen font-semibold"
                >
                  Show Less Announcements
                </button>
              ) : (
                <button
                  onClick={handleShowMore}
                  className="text-white w-full rounded-md p-2 text-[14px] bg-lightGreen font-semibold"
                >
                  Show More Announcements
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-slate-500 text-[13px] italic">
          No announcements available.
        </p>
      )}
    </div>
  );
};

// Dialog that updates the announcement
const EditAnnouncement: React.FC<EditAnnouncementProps> = ({
  dataId,
  title: initialTitle, // Prop for initial title
  content: initialContent, // Prop for initial content
  setDialogOpen,
  dialogueOpen,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(initialTitle);
  const [content, setContent] = useState<string>(initialContent);
  const { toast } = useToast();

  // Query client instance
  const queryClient = useQueryClient();

  useEffect(() => {
    if (dialogueOpen) {
      setTitle(title); // Use passed title
      setContent(content); // Use passed content
    }
  }, [dialogueOpen, title, content]);

  const mutation = useMutation({
    mutationFn: async () => {
      const result = await fetch(`/api/class/announcement`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }, // Added header
        body: JSON.stringify({
          id: dataId,
          desc: content,
          title,
        }),
      });
      return result;
    },

    onSuccess: async (result) => {
      queryClient.invalidateQueries({ queryKey: ["get-single-class-teacher"] });
      if (result.ok) {
        const body = await result.json();
        setLoading(false);
        setDialogOpen(false);
        return toast({
          variant: "default",
          title: "Successful update!!!",
          description: body.message,
          className: " bg-green-500 text-white",
        });
      } else {
        setLoading(false);
        return toast({
          variant: "destructive",
          title: "Update error",
          description: "Error updating announcement.",
        });
      }
    },
  });

  // Handle submit
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent event propagation
    setLoading(true);
    mutation.mutate();
  };

  return (
    <Dialog
      open={dialogueOpen}
      onOpenChange={(isOpen) => {
        if (!loading) {
          setDialogOpen(isOpen);
        }
      }}
    >
      <DialogTrigger asChild>
        <p className="inline text-[13px] cursor-pointer  font-semibold">
          <FaRegEdit className="inline w-4 h-4 mr-2 ml-0 text-lightGreen " />
          Edit
        </p>
      </DialogTrigger>
      <DialogContent className="sm:w-[600px] w-[380px] font-subtext">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">
            Edit Announcement
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 font-header py-4">
          <div className="grid items-center font-header gap-2">
            <p className="font-bold text-[18px]">
              Are you sure you want to edit announcement?
            </p>

            <div className="flex flex-col">
              <Input
                id="name"
                type="text"
                name="title"
                placeholder="Enter the announcement title here"
                className="col-span-6 w-full"
                value={title} // Pre-filled
                onChange={(e) => setTitle(e.target.value)}
                aria-label="Announcement title"
              />
            </div>

            <div className="flex flex-col">
              <textarea
                cols={30}
                rows={10}
                id="name"
                name="content"
                placeholder="Provide the content for the announcement"
                className="col-span-6 p-2 border text-[14px] rounded-md w-full"
                value={content} // Pre-filled
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={(e) => handleSubmit(e)}
            disabled={loading}
            type="submit"
            className="w-full py-8 text-lg bg-lightGreen hover:bg-green-700"
          >
            {loading ? "Editing Announcement..." : "Edit Announcement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

//The Dialog that deletes the announcement
const RemoveAnnouncement: React.FC<RemoveAnnouncementProps> = ({
  dataId,
  setDialogOpen,
  dialogueOpen,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  //   instance of client
  const queryClient = useQueryClient();
  //   creating a delete using mutation to the backend
  const { mutate } = useMutation({
    mutationFn: async (id: string) => {
      const result = await fetch(`/api/class/announcement`, {
        method: "DELETE",
        body: JSON.stringify({
          id: dataId,
        }),
      });
      return result;
    },

    onSuccess: async (result) => {
      queryClient.invalidateQueries({ queryKey: ["get-single-class-teacher"] });
      if (result.ok) {
        const body = await result.json();
        setLoading(false);
        setDialogOpen(false);
        return toast({
          variant: "default",
          title: "Successfully Deleted!!!",
          description: body.message,
          className: " bg-green-500 text-white",
        });
      } else {
        setLoading(false);
        return toast({
          variant: "destructive",
          title: "Update error",
          description: "Error updating this teacher's status",
        });
      }
    },
  });
  const handleDelete = () => {
    setLoading(true);
    mutate(dataId);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="inline text-[13px] cursor-pointer  font-semibold">
          <Trash2 className="inline w-4 h-4 mr-2 ml-0 text-lightGreen " />
          Delete
        </p>
      </DialogTrigger>
      <DialogContent className="sm:w-[500px] w-[380px] font-subtext">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">
            Delete Announcement
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 font-header py-4">
          <div className="flex flex-1 items-center justify-center mx-auto gap-2">
            <Image
              src="/warn.png"
              alt="warning"
              width={200}
              height={100}
              className="w-[50px]"
            />
          </div>
          <div className="grid  items-center font-header gap-4">
            <p className="font-bold text-[18px]  ">
              Are you sure you want to delete announcement?
            </p>
            <p className="text-sm">
              This action can not be reversed, be sure you want to remove before
              you confirm
            </p>
          </div>
        </div>
        <DialogFooter className="">
          <Button
            onClick={handleDelete}
            disabled={loading}
            type="submit"
            className="w-full py-8 text-lg bg-lightGreen hover:bg-green-700"
          >
            {loading ? "Deleting Announcement..." : "Delete Announcement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
// dialog to display a single announcement made
interface ISingleAnnouncement {
  title: string;
  desc: string;
  viewedBy: string[];
  createdAt: string;
}
const ShowAnnouncementDetails: React.FC<{
  id: string;
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  viewedBy: string[];
}> = ({ id, setShowDetails, showDetails, viewedBy }) => {
  const { data: user } = useSession();
  // get a single post
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({ queryKey: ["StudentGroupClass"] });
  const { data, isLoading, isError } = useQuery<ISingleAnnouncement>({
    queryKey: ["get-one-announcement", id],
    queryFn: async () => {
      viewedBy.push(user?.user.id!);
      const response = await fetch(`/api/get-single-anouncement?id=${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      return result;
    },
  });
  // mutation to
  if (isLoading)
    return (
      <Dialog open={showDetails} onOpenChange={() => setShowDetails(false)}>
        <DialogContent className="sm:w-[500px] w-[380px] flex flex-col gap-3 font-subtext">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">
              Announcement details
            </DialogTitle>
          </DialogHeader>
          <div className=" w-full h-[300px] flex items-center justify-center">
            <CircularProgress size={60} color="success" />
          </div>
          <DialogFooter className=""></DialogFooter>
        </DialogContent>
      </Dialog>
    );
  if (isError) return <div>something went wrong...</div>;
  return (
    <Dialog open={showDetails} onOpenChange={() => setShowDetails(false)}>
      <DialogContent className="sm:w-[500px] w-[380px] font-subtext">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">
            <div className=" flex items-center justify-center">
              <p>Announcement details</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className=" flex w-full flex-col gap-2">
          <div className=" flex w-full  font-bold text-[16px]">
            <p>{data?.title!}</p>
          </div>
          <div className=" text-[14px]">
            <p>{data?.desc}</p>
          </div>
        </div>
        <DialogFooter className=""></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// The Update and Delete Announcement options popover
const IndividualAnnouncement = ({
  dataId,
  title,
  content,
  isTeacher,
  viewedBy,
}: IndividualAnnouncementProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="border-none" variant="outline">
          <FaEllipsisH className="ml-3 text-lightGreen " />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40">
        <div className="grid gap-4 font-header">
          <div className="grid gap-2">
            {isTeacher && (
              <div
                onClick={() => setEditDialogOpen(true)}
                className="flex cursor-pointer justify-start"
              >
                <EditAnnouncement
                  setDialogOpen={setEditDialogOpen}
                  dialogueOpen={editDialogOpen}
                  dataId={dataId}
                  title={title}
                  content={content}
                />
              </div>
            )}
            {isTeacher && (
              <div>
                <hr className="bg-black" />
                <div
                  onClick={() => setDeleteDialogOpen(true)}
                  className="flex justify-start"
                >
                  <RemoveAnnouncement
                    setDialogOpen={setDeleteDialogOpen}
                    dialogueOpen={deleteDialogOpen}
                    dataId={dataId}
                  />
                </div>
              </div>
            )}
            <hr className="bg-black" />
            <div>
              <div
                onClick={() => setShowDetails(true)}
                className=" flex font-semibold items-center gap-2 text-[13px] cursor-pointer "
              >
                <FaEye className="inline w-4 h-4  ml-0 text-lightGreen " />
                <p>View</p>
              </div>
              <ShowAnnouncementDetails
                showDetails={showDetails}
                setShowDetails={setShowDetails}
                id={dataId}
                viewedBy={viewedBy}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// const CheckZoomUser = () => {
//   const { id } = useParams();
//   const [creating, setCreating] = useState<boolean>(false);
//   const mutation = useMutation({
//     mutationKey: ["create-meeting-link"],
//     mutationFn: async () => {
//       const response = await fetch("/api/zoom/get-access-code", {
//         method: "POST",
//         body: JSON.stringify({
//           type: "class",
//           id,
//         }),
//       });
//       return response;
//     },
//     onSuccess: async (response) => {
//       setCreating(false);
//       const result = await response.json();
//       window.location.href = result.link;
//     },
//   });
//   const { data, isLoading } = useQuery({
//     queryKey: ["checkzoom"],
//     queryFn: async () => {
//       const response = await fetch("/api/zoom/isconnected");
//       const result = await response.json();
//       return result;
//     },
//   });
//   if (isLoading) {
//     return <div>loading...</div>;
//   }
//   const handleConnectZoom = () => {
//     const url = `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_ZOOM_REDIRECT_URL}`;
//     window.location.href = url;
//   };
//   const handleMakeZoom = () => {
//     setCreating(true);
//     mutation.mutate();
//   };
//   return (
//     <div>
//       {data === null ? (
//         <div
//           onClick={handleConnectZoom}
//           className=" flex items-center px-3 py-3 rounded-md bg-dimOrange w-fit cursor-pointer text-white gap-1"
//         >
//           <BsBroadcast />
//           <p className=" text-[12px]">Connect Zoom</p>
//         </div>
//       ) : (
//         <div>
//           <div
//             onClick={handleMakeZoom}
//             className=" flex items-center px-3 py-3 rounded-md bg-dimOrange w-fit cursor-pointer text-white gap-1"
//           >
//             <BsBroadcast />
//             <p className=" text-[12px]">
//               {creating ? "Starting" : "Start"} Session {creating && "..."}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

const SingleClassroom: React.FC<{ isTeacher: boolean }> = ({ isTeacher }) => {
  const { id } = useParams();
  const [visibleItems, setVisibleItems] = useState(2); // State to manage visible items
  const [isExpanded, setIsExpanded] = useState(false); // To toggle between show more/less
  const { handleDate } = useConversion();
  const [showModel, setshowModel] = useState<boolean>(false);

  const { isLoading, isError, error, data } = useQuery<SingleClassInterface>({
    queryKey: ["get-single-class-teacher"],
    queryFn: async () => {
      const response = await fetch(`/api/class/specific/${id}`);
      const result = await response.json();
      return result;
    },
  });
  //console.log(data);
  //   if is loading
  if (isLoading) {
    return (
      <div className=" mt-4">
        <SingleClassSkeleton />;
      </div>
    );
  }
  // if is error
  if (isError) {
    return <div className=" flex-1">{error.message}</div>;
  }

  const handleShowMore = () => {
    setVisibleItems(data?.AnnouncementByTeacherClass.length || 0);
    setIsExpanded(true); // Toggle expanded state to true
  };

  const handleShowLess = () => {
    setVisibleItems(2); // Show only the initial 3 items
    setIsExpanded(false); // Toggle expanded state to false
  };
  // copy class link below
  const handleCopy = (link: string) => {
    window.navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
  };

  return (
    <div>
      {data && (
        <div key={data.id} className="font-header md:mt-12 mt-24">
          <div className="flex justify-between">
            <p className="font-bold text-lg">Details</p>
            <Link
              href="/teacher-dashboard/classroom"
              className="cursor-pointer"
            >
              <Image
                src="/closeAlt.svg"
                alt="cancel"
                width={100}
                height={100}
                className="w-[20px] h-[20px]"
              />
            </Link>
          </div>

          <div className="grid font-subtext md:grid-cols-3 h-fit sm:grid-cols-2 grid-cols-1 gap-3 mt-6 mb-2">
            <div className="bg-white h-fit py-6 rounded-md">
              <div className="flex justify-between px-6 py-2  pb-1">
                <p className="text-slate-500 text-[14px] mb-3 font-semibold">
                  Overview
                </p>
              </div>
              <div className="px-6 flex  space-x-2 pb-2">
                <Image
                  src={data?.classBanner}
                  alt=""
                  width={100}
                  height={100}
                  className="rounded-md w-[100px] h-[100px]"
                />

                <div className="">
                  <p className="inline text-[13px] font-semibold">
                    <SiGoogleclassroom className="inline w-[15px] mr-1 h-[15px]" />{" "}
                    {data?.className}
                  </p>
                  <p className="mt-3 text-[12.5px]">{data?.grade}</p>
                </div>
              </div>
              <div className="flex px-6 flex-col justify-between">
                <p className="text-[13px] font-semibold">
                  Duration : {data?.duration}{" "}
                </p>
                <p className="text-[13px] my-3 font-semibold">
                  Date Created : {handleDate(data?.createdAt)}
                </p>
              </div>
              <div className=" flex max-sm:flex-col px-3 gap-2">
                <div className=" flex-1">
                  {data.ClasssMeetingLink ? (
                    <JoinClassLink
                      isTeacher={isTeacher}
                      link={data.ClasssMeetingLink.classesId}
                    />
                  ) : (
                    <AddClassLink
                      isTeacher={isTeacher}
                      id={id as string}
                      uploadType="class"
                    />
                  )}
                </div>
                {data.ClasssMeetingLink && isTeacher && (
                  <div className=" flex-1">
                    <div
                      onClick={() => setshowModel(true)}
                      className=" w-full text-green-700 cursor-pointer text-[14px] flex items-center justify-center py-3 border border-green-900 rounded-md hover:bg-green-700 hover:text-white transition-all ease-in-out duration-700"
                    >
                      <p>Edit class Link</p>
                    </div>
                    <AddMettingModel
                      id={id as string}
                      showModel={showModel}
                      setShowmodel={setshowModel}
                      uploadType="class"
                      isCreate={false}
                    />
                  </div>
                )}
              </div>
            </div>
            {/* Announcements Div */}
            <AnnouncementsList
              announcements={data?.AnnouncementByTeacherClass || []}
              isTeacher={isTeacher}
              handleShowMore={handleShowMore}
              handleShowLess={handleShowLess}
              isExpanded={isExpanded}
              visibleItems={visibleItems}
              handleDate={handleDate}
            />
            <div className="bg-white rounded-md py-6 px-6 h-fit">
              <p className="text-slate-500 text-[14px] mb-3 font-semibold">
                Join via link
              </p>
              <p className="my-3 text-[14px] font-semibold">
                Copy the link below, paste in your browser to connect with the
                classroom.
              </p>
              {!isTeacher && (
                <p>You are seeing this because you paid for the class</p>
              )}
              {data.ClasssMeetingLink ? (
                <p className=" text-blue-700 underline">
                  {data.ClasssMeetingLink.link}
                </p>
              ) : (
                <p>class link will appear here</p>
              )}
              <p className="text-[16px] font-semibold my-3">{data.className}</p>
              <Button
                onClick={() => handleCopy(data.ClasssMeetingLink.link)}
                variant="outline"
                className="w-full font-bold border-lightGreen text-lightGreen hover:text-lightGreen"
              >
                Copy class link
              </Button>
            </div>
          </div>

          <SingleClassTable dataId={data?.id} studentIds={data?.studentIDs} />
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default SingleClassroom;
