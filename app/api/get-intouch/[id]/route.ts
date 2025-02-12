// getting only one message using this file
// TODO: use next auth to update this part
// allow only school afrika to get this message

import prisma from "@/prisma/prismaConnect";
import { notAuthenticated, onlyAdmin } from "@/prisma/utils/error";
import { serverSessionId, serverSessionRole } from "@/prisma/utils/utils";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await serverSessionId();
  const role = await serverSessionRole();
  if (!user) return notAuthenticated();
  if (role !== "Admin") return onlyAdmin();
  try {
    const message = await prisma.getInTouch.findUnique({
      where: {
        id: params.id,
      },
    });
    return new Response(JSON.stringify(message), {
      status: 200,
      statusText: "successful",
    });
  } catch (error) {
    throw new Error(JSON.stringify({ message: "something went wrong" }));
  }
}

// the school africka admin can delete this message here
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  //   lets check if the message exist first before deleting
  const message = await prisma.getInTouch.findUnique({
    where: { id: params.id },
  });
  if (!message) {
    return new Response(
      JSON.stringify({ message: "this message no longer exists" }),
      { status: 404, statusText: "message does not exist" }
    );
  }
  //   try and catch using the function below
  try {
    await prisma.getInTouch.delete({
      where: {
        id: params.id,
      },
    });
    return new Response(
      JSON.stringify({ message: "message has been successfully deleted" })
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "something went wrong with the server" }),
      { status: 500 }
    );
  }
}
