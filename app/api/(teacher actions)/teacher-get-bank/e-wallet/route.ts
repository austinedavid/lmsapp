// here, we will get the teachers wallet information for processing
import prisma from "@/prisma/prismaConnect";
import {
  notAuthenticated,
  onlyTeacher,
  serverError,
} from "@/prisma/utils/error";
import { serverSessionId, serverSessionRole } from "@/prisma/utils/utils";
// get the wallet information
export async function GET(req: Request) {
  const userId = await serverSessionId();
  const role = await serverSessionRole();
  if (!userId) return notAuthenticated();
  if (role !== "Teacher") return onlyTeacher();

  try {
    const Einfo = await prisma.ewallet.findFirst({
      where: {
        teacherId: userId,
      },
      select: {
        amt: true,
      },
    });
    return new Response(JSON.stringify(Einfo), { status: 200 });
  } catch (error) {
    return serverError();
  }
}
// processing the withdrawal by submitting to the admin
// so the admin can review and process the payment as required.
export async function POST(req: Request) {
  const userId = await serverSessionId();
  const role = await serverSessionRole();
  const { amt } = await req.json();
  // check for authentication first
  if (!userId) return notAuthenticated();
  if (role !== "Teacher") return onlyTeacher();
  // lets get the ewallet balance first
  // check if the amt to withdraw is bigger than the min withdrawal amt
  // check if the amt to withdraw is less or equal to the balance in the ewallet
  try {
    // get e wallet
    const ewallet = await prisma.ewallet.findFirst({
      where: {
        teacherId: userId,
      },
      select: { amt: true, id: true },
    });
    // check min withdrawable amout
    if (amt < 10) {
      return new Response(
        JSON.stringify({ message: "less than mininum withdrawal" }),
        { status: 400 }
      );
    }
    // check the withdrawable amt is less or equal to the balance in the ewallet
    if (amt > ewallet?.amt!) {
      return new Response(
        JSON.stringify({ message: "insufficient withdrawable amt" }),
        { status: 400 }
      );
    }
    // we can now proceed to withdraw the amount and also update the balance
    await prisma.ewallet.update({
      where: {
        id: ewallet?.id!,
      },
      data: {
        amt: ewallet?.amt! - Number(amt),
        updatedAt: new Date(),
      },
    });
    // create the withdrawal request for admin to Approve and send money
    await prisma.withdrawRequest.create({
      data: {
        amt,
        teacherId: userId,
      },
    });

    return new Response(
      JSON.stringify({ message: "withdraw request submitted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return serverError();
  }
}
