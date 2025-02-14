// here, the teacher get bank details to display
import prisma from "@/prisma/prismaConnect";
import { notAuthenticated, serverError } from "@/prisma/utils/error";
import { serverSessionId } from "@/prisma/utils/utils";

export async function GET(req: Request) {
  const userId = await serverSessionId();
  if (!userId) return notAuthenticated();
  try {
    const banKInfo = await prisma.teacher.findUnique({
      where: { id: userId },
      select: {
        bankName: true,
        accountName: true,
        accountNo: true,
      },
    });
    return new Response(JSON.stringify(banKInfo), { status: 200 });
  } catch (error) {
    return serverError();
  }
}
