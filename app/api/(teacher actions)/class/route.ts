// in this route we allow the teacher to create a new class
// delete or update the class they created;
// and also to get all their classes here
// then in the applied-class route, the student will be able to be added to the class after making their payments
import prisma from "@/prisma/prismaConnect";
import { serverError } from "@/prisma/utils/error";

// here, teachers can create a class
export async function POST(req: Request) {
  // TODO: remember to change the id here to the nextauth id
  const { id, others } = await req.json();
  if (!id) {
    return new Response(
      JSON.stringify({ message: "you are not authenticated" }),
      { status: 401 }
    );
  }
  try {
    await prisma.classes.create({
      data: { teacherId: id, ...others },
    });
  } catch (error) {
    throw new Error(JSON.stringify({ message: "something went wrong" }));
  }
}

// here, teachers can delete their class
export async function DELETE(req: Request) {
  // TODO: change the id to the next auth id
  const { id, teacherId } = await req.json();
  if (!teacherId) {
    return new Response(
      JSON.stringify({ message: "you are not authenticated" }),
      { status: 400 }
    );
  }
  // now lets get the class we want to delete
  // return an error if the class does not exist
  // then also return an error if the teacherId does not match
  const oneClass = await prisma.classes.findUnique({ where: { id } });
  if (!oneClass) {
    return new Response(
      JSON.stringify({ message: "this class does not exist" }),
      { status: 400 }
    );
  }
  if (oneClass.teacherId !== teacherId) {
    return new Response(
      JSON.stringify({ message: "you can only delete class you created" })
    );
  }
  //   we can now finally delete the class
  try {
    await prisma.classes.delete({
      where: { id },
    });
  } catch (error) {
    return serverError();
  }
}

// here a teacher can get all the class that he or she created
export async function GET(req: Request) {
  // TODO:remember to change this static teacherId to nextauth id
  const teacherId = "1234567";
  try {
    const allClass = await prisma.classes.findMany({ where: { teacherId } });
    return new Response(JSON.stringify(allClass), { status: 200 });
  } catch (error) {
    return serverError();
  }
}
