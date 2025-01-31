// here we will create a class link for the student to join for a class
import prisma from "@/prisma/prismaConnect";
import {
  notAuthenticated,
  onlyTeacher,
  serverError,
} from "@/prisma/utils/error";
import { serverSessionId, serverSessionRole } from "@/prisma/utils/utils";

// lets create the class link
export async function POST(req: Request) {
  const { link, id } = await req.json();
  // check for authentication of the teacher
  const teacherId = await serverSessionId();
  const role = await serverSessionRole();
  if (!teacherId) return notAuthenticated();
  if (role !== "Teacher") return onlyTeacher();
  // first, lets check if the applied session actually exist
  // return error if it does not exist
  const theClass = await prisma.classes.findUnique({
    where: {
      id,
    },
    select: {
      teacherId: true,
    },
  });
  if (theClass?.teacherId !== teacherId)
    return new Response(JSON.stringify({ message: "illegal path!!!" }), {
      status: 400,
    });
  // now we can proceed to create the link here
  try {
    await prisma.classsMeetingLink.create({
      data: {
        link,
        classesId: id,
      },
    });
    return new Response(
      JSON.stringify({ message: "class link created successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return serverError();
  }
}

// here, we will make a put request to modify the class link
export async function PUT(req: Request) {
  const userId = await serverSessionId();
  const role = await serverSessionRole();
  const { link, id } = await req.json();

  if (!userId) return notAuthenticated();
  if (role !== "Teacher") return onlyTeacher();
  const getTheLink = await prisma.classsMeetingLink.findFirst({
    where: {
      classesId: id,
    },
  });

  if (!getTheLink)
    return new Response(
      JSON.stringify({ message: "this meeting does not exist" }),
      { status: 400 }
    );
  try {
    await prisma.classsMeetingLink.update({
      where: { id: getTheLink?.id },
      data: { link },
    });
    return new Response(
      JSON.stringify({ message: "class link successfully updated" }),
      { status: 200 }
    );
  } catch (error) {
    return serverError();
  }
}
