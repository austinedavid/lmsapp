// here, we will allow the student to view an announcement
// add also add their id in the array as required
import prisma from "@/prisma/prismaConnect";
import { notAuthenticated, serverError } from "@/prisma/utils/error";
import {
  getQuery,
  serverSessionId,
  serverSessionRole,
} from "@/prisma/utils/utils";

export async function GET(req: Request) {
  const id = getQuery(req.url, "id");
  // checking for authentication first
  const userId = await serverSessionId();
  if (!userId) return notAuthenticated();
  try {
    // first get the requested post
    const singlePost = await prisma.announcementByTeacherClass.findUnique({
      where: { id },
      select: {
        title: true,
        desc: true,
        viewedBy: true,
        createdAt: true,
      },
    });
    // check if the user has viewed the announcement before
    const userIncluded = singlePost?.viewedBy.includes(userId);
    if (!userIncluded) {
      await prisma.announcementByTeacherClass.update({
        where: { id },
        data: {
          viewedBy: { push: userId },
        },
      });
    }
    return new Response(JSON.stringify(singlePost), { status: 200 });
  } catch (error) {
    return serverError();
  }
}
