// here, we will handle getting all the transactions performed by a user over the time
import prisma from "@/prisma/prismaConnect";
import { notAuthenticated, serverError } from "@/prisma/utils/error";
import { getQuery, serverSessionId } from "@/prisma/utils/utils";

export async function GET(req: Request) {
  const userId = await serverSessionId();
  if (!userId) return notAuthenticated();
  const brief = getQuery(req.url, "brief") == "true";
  // we go ahead and get all the informations registered so far
  // about the teacher and its transactions
  try {
    if (brief) {
      const allTransactions = await prisma.transaction.findMany({
        where: {
          userId,
        },
        take: 5,
        orderBy: {
          updatedAt: "desc",
        },
      });
      return new Response(JSON.stringify(allTransactions), { status: 200 });
    } else {
      const allTransactions = await prisma.transaction.findMany({
        where: {
          userId,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      return new Response(JSON.stringify(allTransactions), { status: 200 });
    }
  } catch (error) {
    return serverError();
  }
}
