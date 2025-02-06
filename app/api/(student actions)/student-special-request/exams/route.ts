// here, we will allow the special-request students to write their exams
// here, this route handles when student answers their questions
// this exam will be updated and saved
import prisma from "@/prisma/prismaConnect";
import {
  notAuthenticated,
  onlyStudent,
  serverError,
} from "@/prisma/utils/error";
import {
  getQuery,
  markExams,
  serverSessionId,
  serverSessionRole,
} from "@/prisma/utils/utils";

// make an update request here
export async function PUT(req: Request) {
  // check for authentication
  const studentId = await serverSessionId();
  const role = await serverSessionRole();
  if (!studentId) return notAuthenticated();
  if (role !== "Student") return onlyStudent();
  const { studentExamId, answeredTest } = await req.json();
  if (!studentId) return notAuthenticated();
  // here, lets fetch the studentExam and know if the exam was complated before
  // we will return an error if it is completed already
  const checkExamStatus = await prisma.specialStudentExam.findUnique({
    where: { id: studentExamId },
    select: { completed: true },
  });
  if (checkExamStatus?.completed)
    return new Response(
      JSON.stringify({ message: "this exam has been completed already" }),
      { status: 404 }
    );
  // continue here to calculate the total score of the test written
  //   first, we will map the answered test and return the total number that was answered correctly
  const { correctAnswer, percentage } = markExams(answeredTest);
  // now, lets update the studentExam now
  try {
    await prisma.specialStudentExam.update({
      where: { id: studentExamId },
      data: {
        completed: true,
        score: correctAnswer,
        percentage: percentage,
        questions: answeredTest,
      },
    });
    return new Response(
      JSON.stringify({
        message: `you have answered ${correctAnswer} correctly, check for corrections`,
      }),
      { status: 200 }
    );
  } catch (error) {
    return serverError();
  }
}

export async function GET(req: Request) {
  const userId = await serverSessionId();
  if (!userId) return notAuthenticated();
  const examId = getQuery(req.url, "examId");
  try {
    const singleExam = await prisma.specialStudentExam.findUnique({
      where: {
        id: examId,
      },
    });
    if (!singleExam) {
      return new Response(
        JSON.stringify({ message: "this exam does not exist" }),
        { status: 404 }
      );
    }
    return new Response(JSON.stringify(singleExam), { status: 200 });
  } catch (error) {
    return serverError();
  }
}
