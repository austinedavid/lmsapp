// here we should be able to get a single special request
import prisma from "@/prisma/prismaConnect";
import { notAuthenticated, serverError } from "@/prisma/utils/error";
import { specialRequest } from "@/prisma/utils/payment";
import { serverSessionId } from "@/prisma/utils/utils";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userId = await serverSessionId();
  if (!userId) return notAuthenticated();

  try {
    const singleRequest = await prisma.specialTeacherMerged.findUnique({
      where: { id: params.id },
      include: {
        student: {
          select: {
            name: true,
            profilePhoto: true,
            grade: true,
            gender: true,
            email: true,
            address: true,
            disable: true,
          },
        },
        teacher: {
          select: {
            name: true,
            profilePhoto: true,
            email: true,
            phoneNo: true,
          },
        },
        SpecialStudentExam: true,
      },
    });
    if (!singleRequest) return;
    const { SpecialStudentExam, ...others } = singleRequest;
    const modifiedSpecialRequest = {
      ...others,
      StudentExam: singleRequest.SpecialStudentExam,
    };

    return new Response(JSON.stringify(modifiedSpecialRequest), {
      status: 200,
    });
  } catch (error) {
    return serverError();
  }
}
