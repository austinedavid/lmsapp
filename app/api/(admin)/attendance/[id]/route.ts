// here, we will write the logic to return the attendance
// which a teacher achieved in one month in a particular year.
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
    // here, we find all the attendance of student under one on one session
    const sessionAttendance = await prisma.sessionAttendance.findMany({
      where: {
        teacherId: params.id,
      },
      include: {
        session: {
          select: {
            student: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
    });
    // here, lets return the attendance conducted so far by the months and year indicated
    const filteredAttendance = sessionAttendance.filter((item) => {
      const date = new Date(item.createdAt);
      const Fmonth = date.getMonth();
      const Fyear = date.getFullYear().toString();

      return Fyear === year && Fmonth === Number(month);
    });
    // lets create a fresh array which will easily contain the name of the students
    // let the students name be easily accessible in the object
    const attendanceMapped = filteredAttendance.map((item) => {
      return {
        name: item.session.student.name,
        id: item.session.student.id,
        duration: item.duration,
        held: item.held,
        classday: item.classday,
      };
    });
    const groupedByName = attendanceMapped.reduce((acc, item) => {
      const name = item.name || "unknown";
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push(item);
      return acc;
    }, {} as Record<string, typeof attendanceMapped>);
    // Convert the object back to an array if necessary
    const groupedArray = Object.entries(groupedByName).map(([name, items]) => ({
      name,
      items,
    }));
    const results =
      sessionAttendance && groupedArray.length > 0 ? groupedArray : [];

    // handle the function that fetch attendance of all student in special requests
    const specialAttendance = await prisma.specialRequestAttendance.findMany({
      where: { teacherId: params.id },
      include: {
        session: {
          select: {
            student: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
    });
    const filteredSpecialAttendance = specialAttendance.filter((item) => {
      const date = new Date(item.createdAt);
      const Fmonth = date.getMonth();
      const Fyear = date.getFullYear().toString();

      return Fyear === year && Fmonth === Number(month);
    });
    const specialAttendanceMapped = filteredAttendance.map((item) => {
      return {
        name: item.session.student.name,
        id: item.session.student.id,
        duration: item.duration,
        held: item.held,
        classday: item.classday,
      };
    });
    const specialGroupedByName = specialAttendanceMapped.reduce((acc, item) => {
      const name = item.name || "unknown";
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push(item);
      return acc;
    }, {} as Record<string, typeof attendanceMapped>);
    // Convert the object back to an array if necessary
    const specialGroupedArray = Object.entries(specialGroupedByName).map(
      ([name, items]) => ({
        name,
        items,
      })
    );
    const specialresults =
      specialAttendance && specialGroupedArray.length > 0
        ? specialGroupedArray
        : [];
    const joinedAttendance = [...results, ...specialresults];
    console.log(joinedAttendance);
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    return serverError();
  }
}
