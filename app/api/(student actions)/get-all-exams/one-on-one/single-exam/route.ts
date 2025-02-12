// here, we will access the student one on one exam
import prisma from "@/prisma/prismaConnect";
import { notAuthenticated, serverError } from "@/prisma/utils/error";
import { getQuery, serverSessionId } from "@/prisma/utils/utils";

export async function GET(req: Request) {
  const examId = getQuery(req.url, "examId");
  const user = await serverSessionId();
  if (!user) return notAuthenticated();

  try {
    const oneExam = await prisma.studentExam.findUnique({
      where: { id: examId },
    });
    // return error if the exam does not exist
    if (!oneExam) {
      return new Response(
        JSON.stringify({ message: "This exam does not exist" }),
        { status: 404 }
      );
    }
    return new Response(JSON.stringify(oneExam), { status: 200 });
  } catch (error) {
    return serverError();
  }
}
