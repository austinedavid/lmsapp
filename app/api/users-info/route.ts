// here, we will get users basic information
import prisma from "@/prisma/prismaConnect";
import { serverError } from "@/prisma/utils/error";
import { serverSessionId, serverSessionRole } from "@/prisma/utils/utils";

export async function GET(req: Request) {
  const userId = await serverSessionId();
  const role = await serverSessionRole();
  try {
    // check if is teacher that want to update
    if (role == "Teacher") {
      const userInfo = await prisma.teacher.findUnique({
        where: { id: userId },
        select: {
          name: true,
          address: true,
          email: true,
          phoneNo: true,
        },
      });
      return new Response(JSON.stringify(userInfo), { status: 200 });
    }
    // check if is student that want to update
    if (role == "Student") {
      const userInfo = await prisma.student.findUnique({
        where: { id: userId },
        select: {
          name: true,
          address: true,
          email: true,
          phoneNo: true,
          gender: true,
          grade: true,
        },
      });
      return new Response(JSON.stringify(userInfo), { status: 200 });
    }
    if (role == "Parents") {
      const userInfo = await prisma.parents.findUnique({
        where: { id: userId },
        select: {
          name: true,
          address: true,
          email: true,
          phoneNo: true,
        },
      });
      return new Response(JSON.stringify(userInfo), { status: 200 });
    }
  } catch (error) {
    return serverError();
  }
}
