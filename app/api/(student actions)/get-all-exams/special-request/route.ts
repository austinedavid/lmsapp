// here we will get all the exams taken by a student in their special request  classes
import prisma from "@/prisma/prismaConnect";
import { notAuthenticated, serverError } from "@/prisma/utils/error";
import { getQuery, serverSessionId } from "@/prisma/utils/utils";

export async function GET(req: Request) {
  const studentId = getQuery(req.url, "studentId");
  console.log("Student ID:", studentId); 
  const userId = await serverSessionId();
  if (!userId) return notAuthenticated();
  try {
    //   lets first get the special request the student belongs to
    const allSpecialRequest = await prisma.specialTeacherMerged.findMany({
      where: {
        studentId,
      },
      select: {
        SpecialStudentExam: {
          where: {
            completed: true,
          },
        },
      },
    });
    return new Response(JSON.stringify(allSpecialRequest), { status: 200 });
  } catch (err) {
    return serverError();
  }
}
