// this route we create the api for getting messages created by the user
// this should only be viewed by the school afrika
// but can be created by anyone, maybe register or not registered members
import prisma from "@/prisma/prismaConnect";
import { notAuthenticated, onlyAdmin, serverError } from "@/prisma/utils/error";
import { serverSessionId, serverSessionRole } from "@/prisma/utils/utils";

// lets first create the get intouch messages
export async function POST(req: Request) {
  const { message, name, phoneNo, email } = await req.json();
  // if any field is missing, return this error to the user
  if (!message || !name || !phoneNo || !email) {
    return new Response(JSON.stringify({ message: "all field are required" }), {
      status: 404,
      statusText: "Not Found",
    });
  }
  // proceed to creating the message
  // using try create then catch error if not successful
  try {
    await prisma.getInTouch.create({
      data: {
        name,
        message,
        email,
        phoneNo,
      },
    });
    return new Response(
      JSON.stringify({ message: "message created successfully" }),
      { statusText: "successful" }
    );
  } catch (error) {
    throw new Error(
      JSON.stringify({
        message: "Something went wrong while creating the message",
      })
    );
  }
}

// here, we create a get request,
// making sure is only the school afrika teams that get this information
export async function GET(req: Request) {
  const user = await serverSessionId();
  const role = await serverSessionRole();
  if (!user) return notAuthenticated();
  if (role !== "Admin") return onlyAdmin();
  try {
    const allMessages = await prisma.getInTouch.findMany({
      orderBy: { createdAt: "desc" },
    });
    return new Response(JSON.stringify(allMessages), {
      status: 200,
      statusText: "success",
    });
  } catch (error) {
    return serverError();
  }
}
