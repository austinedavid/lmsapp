// in this route, teacher will be able to submit their kyc
import prisma from "@/prisma/prismaConnect";
import { notAuthenticated, serverError } from "@/prisma/utils/error";
import { serverSessionId, serverSessionRole } from "@/prisma/utils/utils";

// here the teacher submit their kyc details for approval
export async function POST(req: Request) {
  const payload = await req.json();
  console.log(payload);
  const teacherId = await serverSessionId();
  const role = await serverSessionRole();
  // check if the user is a teacher or if user exist
  if (!teacherId) return notAuthenticated();
  if (role !== "Teacher")
    return new Response(
      JSON.stringify({ message: "only teachers are allowed" }),
      { status: 404 }
    );
  // we go on to create the kyc
  try {
    await prisma.kyc.create({
      data: {
        teacherId,
        ...payload,
      },
    });
    return new Response(
      JSON.stringify({ message: "KYC submitted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return serverError();
  }
}

// here we get the kyc of a teacher that have submitted
export async function GET(req: Request) {
  const teacherId = await serverSessionId();
  try {
    const checkKyc = await prisma.kyc.findFirst({
      where: { teacherId },
    });
    console.log(checkKyc);
    return new Response(JSON.stringify(checkKyc), { status: 200 });
  } catch (error) {
    return serverError();
  }
}
