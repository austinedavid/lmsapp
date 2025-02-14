// here we will get the plan of the teacher as required
import prisma from "@/prisma/prismaConnect";
import { notAuthenticated, serverError } from "@/prisma/utils/error";
import { serverSessionId } from "@/prisma/utils/utils";

export async function GET(req: Request) {
  const userId = await serverSessionId();
  if (!userId) return notAuthenticated();
  try {
    const plans = await prisma.teachersPlans.findFirst({
      where: {
        teacherId: userId,
      },
      select: {
        plan: true,
        expireDate: true,
      },
    });
    return new Response(JSON.stringify(plans), { status: 200 });
  } catch (error) {
    return serverError();
  }
}
