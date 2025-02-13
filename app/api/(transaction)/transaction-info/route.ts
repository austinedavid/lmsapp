// here, we will handle getting all the transactions performed by a user over the time
import prisma from "@/prisma/prismaConnect";
import { notAuthenticated, serverError } from "@/prisma/utils/error";
import { serverSessionId } from "@/prisma/utils/utils";

export async function GET(req: Request) {
  const userId = await serverSessionId();
  if (!userId) return notAuthenticated();
  // we go ahead and get all the informations registered so far
  // about the teacher and its transactions
  try {
    const allTransactions = await prisma.transaction.findMany({
      where: {
        userId,
      },
    });
    return new Response(JSON.stringify(allTransactions), { status: 200 });
  } catch (error) {
    return serverError();
  }
}
