// here, the teacher that has a section can add a resources in the one on one section
// her can also delete the resources add to an particular one on one section
import prisma from "@/prisma/prismaConnect";
import {
  notAuthenticated,
  onlyTeacher,
  serverError,
} from "@/prisma/utils/error";
import { serverSessionId, serverSessionRole } from "@/prisma/utils/utils";

// here, we can add a resources to the one on one section
export async function POST(req: Request) {
  const teacherId = await serverSessionId();
  if (!teacherId) return notAuthenticated();
  const { resourceId, sectionId } = await req.json();
  if (!teacherId) return notAuthenticated();
  // lets get the resouces and make sure is the owner that want to add it to a section
  const getArticle = await prisma.teachersArticle.findUnique({
    where: {
      id: resourceId,
    },
    select: {
      teacherId: true,
    },
  });
  if (getArticle?.teacherId !== teacherId)
    return new Response(
      JSON.stringify({
        message: "you can only added the resources you created",
      }),
      { status: 400 }
    );
  // lets now get the one and one section so we can manipulate the resources field and update it
  //   we will then check if is the teacher that created the one-on-one section that actually want to add the material
  const getSection = await prisma.appliedSection.findUnique({
    where: { id: sectionId },
    select: {
      oneOnOneSectionId: true,
      resources: true,
    },
  });
  if (!getSection)
    return new Response(
      JSON.stringify({ message: "this section does not exist" }),
      { status: 400 }
    );
  const getone_one_one_section = await prisma.oneOnOneSection.findUnique({
    where: { id: getSection?.oneOnOneSectionId },
    select: { teacherId: true },
  });
  if (getone_one_one_section?.teacherId !== teacherId)
    return new Response(
      JSON.stringify({ message: "you can't add resources to this section" }),
      { status: 404 }
    );
  // lets check if the resources is already existing first
  const itExist = getSection.resources.find((item) => item == resourceId);
  if (itExist) {
    return new Response(
      JSON.stringify({ message: "resource already exists" }),
      { status: 400 }
    );
  }
  // here we then add
  try {
    const all = await prisma.appliedSection.update({
      where: { id: sectionId },
      data: { resources: [...getSection?.resources, resourceId] },
    });
    return new Response(
      JSON.stringify({ message: "resources added successfully" })
    );
  } catch (error) {
    return serverError();
  }
}

// here the teacher should be able to remove a particular resource
export async function DELETE(req: Request) {
  const teacherId = await serverSessionId();
  const role = await serverSessionRole();
  const { resourceId, sectionId } = await req.json();
  if (!teacherId) {
    return notAuthenticated();
  }
  if (role !== "Teacher") return onlyTeacher();
  // lets now get the one and one section so we can manipulate the resources field and update it
  //   we will then check if is the teacher that created the one-on-one section that actually want to add the material
  const getSection = await prisma.appliedSection.findUnique({
    where: { id: sectionId },
    select: {
      oneOnOneSectionId: true,
      resources: true,
    },
  });
  if (!getSection)
    return new Response(
      JSON.stringify({ message: "this section does not exist" }),
      { status: 400 }
    );
  const getone_one_one_section = await prisma.oneOnOneSection.findUnique({
    where: { id: getSection?.oneOnOneSectionId },
    select: { teacherId: true },
  });
  if (getone_one_one_section?.teacherId !== teacherId)
    return new Response(
      JSON.stringify({ message: "you can't remove resources to this section" }),
      { status: 404 }
    );

  try {
    const filteredArticles = getSection.resources.filter(
      (item) => item !== resourceId
    );
    await prisma.appliedSection.update({
      where: { id: sectionId },
      data: { resources: filteredArticles },
    });
    return new Response(
      JSON.stringify({ message: "resources deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return serverError();
  }
}
