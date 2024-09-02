import React from "react";
import BookSessionByParents from "./BookSessionByParents";
import BookSessionByStudent from "./BookSessionByStudent";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const BookSession: React.FC<{
  sessionId: string;
  tutorName: string;
  tutorImg: string;
  tutorLang: string;
}> = ({ sessionId, tutorImg, tutorLang, tutorName }) => {
  const { data, status } = useSession();
  //   function to return error message if the user is not logged in or not student or parents
  const handleShowError = () => {
    if (status === "unauthenticated") {
      return toast.error("login to book a session");
    }
    return toast.error("only students and parents can book a session");
  };
  return (
    <div>
      {data?.user.role === "Student" ? (
        <div className=" z-10">
          <BookSessionByStudent
            sessionId={sessionId}
            tutorImg={tutorImg}
            tutorLang={tutorLang}
            tutorName={tutorName}
          />
        </div>
      ) : data?.user.role === "Parents" ? (
        <div className=" z-10">
          <BookSessionByParents
            sessionId={sessionId}
            tutorImg={tutorImg}
            tutorLang={tutorLang}
            tutorName={tutorName}
          />
        </div>
      ) : (
        <div
          onClick={handleShowError}
          className=" text-white w-full  bg-green-700 rounded-md px-4 py-4 sm:py-4 text-[14px] flex items-center justify-center cursor-pointer"
        >
          Book Session
        </div>
      )}
    </div>
  );
};

export default BookSession;
