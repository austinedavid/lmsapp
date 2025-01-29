// here we will return all he exams student took in the one on one session
import prisma from "@/prisma/prismaConnect";
import { notAuthenticated, serverError } from "@/prisma/utils/error";
import { getQuery, serverSessionId } from "@/prisma/utils/utils";

export async function GET(req: Request) {
  const studentId = getQuery(req.url, "studentId");
  const userId = await serverSessionId();
  if (!userId) return notAuthenticated();
  // let get the one on one session
  // that the student is involved in
  try {
    const session = await prisma.appliedSection.findMany({
      where: { studentId },
      select: {
        StudentExam: {
          where: {
            completed: true,
          },
        },
      },
    });
    return new Response(JSON.stringify(session), { status: 200 });
  } catch (err) {
    return serverError();
  }
}
