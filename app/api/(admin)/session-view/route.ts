// in this route
// admins will be able to get all the sessions that have not been merged
// and also be able to merge a particular teacher to a particular session
import prisma from "@/prisma/prismaConnect";
import { notAuthenticated, onlyAdmin, serverError } from "@/prisma/utils/error";
import {
  checkKyc,
  getQuery,
  serverSessionId,
  serverSessionRole,
} from "@/prisma/utils/utils";

// here we get all the adminsessionview
export async function GET(req: Request) {
  const merged = getQuery(req.url, "merged");
  const id = await serverSessionId();
  const role = await serverSessionRole();
  // restriction if the user is not admin
  if (!id) return notAuthenticated();
  if (role !== "Admin") return onlyAdmin();
  try {
    const allSessions = await prisma.adminSectionView.findMany({
      where: { merged: merged === "true" ? true : false },
      include: {
        sectionInfo: {
          select: {
            sessionId: true,
            teacher: {
              select: {
                profilePhoto: true,
                email: true,
                name: true,
              },
            },
          },
        },
        student: {
          select: {
            profilePhoto: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(allSessions), { status: 200 });
  } catch (error) {
    return serverError();
  }
}

// here we merge a student to a particular teacher session
export async function PUT(req: Request) {
  const id = await serverSessionId();
  const role = await serverSessionRole();
  // restriction if the user is not admin
  if (!id) return notAuthenticated();
  if (role !== "Admin") return onlyAdmin();
  // here we get the id of the teacher we want to merge
  // and also get the id of the adminSession that the student or parents created while making
  // a request for one on one session
  const { adminSessionId, teacherSessionId, amt } = await req.json();
  console.log(adminSessionId, teacherSessionId, amt);
  // now let't get the whole information about the session made by the student
  const adminSessionView = await prisma.adminSectionView.findUnique({
    where: {
      id: adminSessionId,
    },
  });

  if (!adminSessionView) {
    return new Response(
      JSON.stringify({ message: "this session does not exist" }),
      { status: 404 }
    );
  }

  if (adminSessionView.merged) {
    return new Response(
      JSON.stringify({ message: "this session is already merged" }),
      { status: 400 }
    );
  }
  // now, lets get the id of the teacher based on the sessionId provided by the admin
  const selectedTeacher = await prisma.oneOnOneSection.findFirst({
    where: { sessionId: teacherSessionId },
    select: {
      id: true,
    },
  });

  try {
    // now lets  merge a teacher to a student
    // by creating a new session model for them
    await prisma.appliedSection.create({
      data: {
        oneOnOneSectionId: selectedTeacher?.id!,
        studentId: adminSessionView.studentId,
        subject: adminSessionView.subject,
        grade: adminSessionView.grade,
        sectionType: adminSessionView.sectionType,
        classStart: adminSessionView.startTime,
        specialNeed: adminSessionView.specialNeed,
        learningGoal: adminSessionView.learningGoal,
        learningDays: adminSessionView.learningDays,
        hoursperday: adminSessionView.hoursperday,
        duration: adminSessionView.duration,
        startTime: adminSessionView.startTime,
        amt: Number(amt),
        adminSectionViewId: adminSessionId,
      },
    });
    // now we can proceed to making the field merge in the adminsessionView to true,
    // this signifies that the student have been merged successfully
    await prisma.adminSectionView.update({
      where: { id: adminSessionId },
      data: {
        merged: true,
      },
    });
    // TODO: below here modify the teachers payment info, to add up the new payment
    // we will also allow the admin to pass extra payload for the amout to pay the teacher for the session
    return new Response(JSON.stringify({ message: "Merged successfully" }), {
      status: 200,
    });
  } catch (error) {
    return serverError();
  }
}

// here, we make use of this endpoint to reassign a teacher to a particular student
// this will help retain the information of the uploaded resources of the former teacher
// and also their test
export async function POST(req: Request) {
  console.log("entered here now ooooo");
  const id = await serverSessionId();
  const role = await serverSessionRole();
  if (!id) return notAuthenticated();
  if (role !== "Admin") return onlyAdmin();
  const { amt, adminSessionId, teacherSessionId } = await req.json();
  // first, lets get the applied session model using the adminSessionId provided
  const getAppliedSession = await prisma.appliedSection.findFirst({
    where: { adminSectionViewId: adminSessionId },
    select: {
      id: true,
    },
  });
  if (!getAppliedSession) {
    return new Response(
      JSON.stringify({ message: "this session was not merged before" }),
      { status: 400 }
    );
  }
  // now we update the applied session to have the information of the teacher we passed
  try {
    // get the teachers one-on-one-session id using the teacherSessionId provided
    const selectedTeacher = await prisma.oneOnOneSection.findFirst({
      where: { sessionId: teacherSessionId },
      select: {
        id: true,
      },
    });
    if (!selectedTeacher) {
      return new Response(
        JSON.stringify({ message: "this teacher does not exist" }),
        { status: 404 }
      );
    }
    // now, we move to modify the session with the new teacher
    await prisma.appliedSection.update({
      where: { id: getAppliedSession.id },
      data: {
        oneOnOneSectionId: selectedTeacher.id,
        amt: Number(amt),
      },
    });
    return new Response(
      JSON.stringify({ message: "tutor successfully changed" }),
      { status: 200 }
    );
  } catch (error) {
    return serverError();
  }
}
