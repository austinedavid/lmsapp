import prisma from "@/prisma/prismaConnect";
import { serverError } from "@/prisma/utils/error";
import { getQuery } from "@/prisma/utils/utils";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const year = getQuery(req.url, "year");
  const month = getQuery(req.url, "month");

  try {
    // Fetch attendance data from both session and special request attendance
    const [sessionAttendance, specialAttendance] = await Promise.all([
      prisma.sessionAttendance.findMany({
        where: { teacherId: params.id },
        include: {
          session: {
            select: {
              student: { select: { name: true, id: true } },
            },
          },
        },
      }),
      prisma.specialRequestAttendance.findMany({
        where: { teacherId: params.id },
        include: {
          session: {
            select: {
              student: { select: { name: true, id: true } },
            },
          },
        },
      }),
    ]);

    // Function to process attendance data
    const processAttendance = (attendanceData: any[]) => {
      return attendanceData
        .filter((item) => {
          const date = new Date(item.createdAt);
          return (
            date.getFullYear().toString() === year &&
            date.getMonth() === Number(month)
          );
        })
        .map((item) => ({
          name: item.session.student.name,
          id: item.session.student.id,
          duration: item.duration,
          held: item.held,
          classday: item.classday,
        }));
    };

    // Process both session and special request attendance
    const sessionProcessed = processAttendance(sessionAttendance);
    const specialProcessed = processAttendance(specialAttendance);

    // Merge both attendance lists based on student name
    const mergedAttendance = [...sessionProcessed, ...specialProcessed].reduce(
      (acc, item) => {
        if (!acc[item.name]) {
          acc[item.name] = [];
        }
        acc[item.name].push(item);
        return acc;
      },
      {} as Record<string, typeof sessionProcessed>
    );

    // Convert object back to an array
    const finalAttendanceArray = Object.entries(mergedAttendance).map(
      ([name, items]) => ({
        name,
        items,
      })
    );

    return new Response(JSON.stringify(finalAttendanceArray), { status: 200 });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return serverError();
  }
}
