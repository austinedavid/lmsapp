// here, we will be able to create the attendance,
// get the attendance
// delete a particular attendance
// or possibly update an attendance
import prisma from "@/prisma/prismaConnect";
import {
  notAuthenticated,
  onlyTeacher,
  serverError,
} from "@/prisma/utils/error";
import {
  getQuery,
  serverSessionId,
  serverSessionRole,
} from "@/prisma/utils/utils";

export async function POST(req: Request) {
  const { sessionId, classday, held, duration, heldType } = await req.json();
  const teacherId = await serverSessionId();
  const role = await serverSessionRole();
  // lets check for authentication first
  if (!teacherId) return notAuthenticated();
  if (role !== "Teacher") return onlyTeacher();
  //  check if the teacher is allowed to take the attendance
  const specialRequest = await prisma.specialTeacherMerged.findUnique({
    where: { id: sessionId },
    select: {
      teacherId: true,
    },
  });
  if (specialRequest?.teacherId !== teacherId) {
    return new Response(
      JSON.stringify({
        message: "Teacher is not allowed to take this attendance",
      }),
      { status: 404 }
    );
  }
  // check if attendance is already taken for the day
  // return error if its already taken or existing
  const checkExistence = await prisma.specialRequestAttendance.findFirst({
    where: {
      specialTeacherMergedId: sessionId,
      classday,
    },
  });
  if (checkExistence) {
    return new Response(
      JSON.stringify({ message: "attendance already taken for the day" }),
      { status: 400 }
    );
  }
  try {
    await prisma.specialRequestAttendance.create({
      data: {
        teacherId,
        specialTeacherMergedId: sessionId,
        classday,
        held,
        duration: held ? Number(duration) : 0,
        heldType,
      },
    });
    return new Response(
      JSON.stringify({ message: "attendance successfully marked" }),
      { status: 200 }
    );
  } catch (error) {
    return serverError();
  }
}
