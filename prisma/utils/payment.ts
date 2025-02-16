import prisma from "../prismaConnect";
import { serverError } from "./error";
import { BalanceAddition } from "./utils";

// here we make payment for classes
export const payForClass = async (classId: string, studentId: string) => {
  const theclass = await prisma.classes.findUnique({
    where: { id: classId },
    select: { studentIDs: true, teacherId: true, price: true },
  });
  // lets check if the student already exist in the class,
  // if it exists, we will return and not add the sudent
  const isStudentAmong = theclass?.studentIDs.find(
    (item) => item === studentId
  );
  if (isStudentAmong) {
    return new Response(JSON.stringify({ message: "student already exists" }), {
      status: 200,
    });
  }
  theclass?.studentIDs.push(studentId);
  // here we get the student information, so that we can push the class id to it
  const theStudent = await prisma.student.findUnique({
    where: { id: studentId },
    select: { classIDs: true },
  });
  theStudent?.classIDs.push(classId);
  try {
    // push the student id to the class
    await prisma.classes.update({
      where: { id: classId },
      data: { studentIDs: theclass?.studentIDs },
    });
    // then we go ahead to also modify the student profile
    // by adding the classid to the array of classes student attend to
    await prisma.student.update({
      where: {
        id: studentId,
      },
      data: { classIDs: theStudent?.classIDs },
    });
    // Create the users transaction information for student
    await prisma.transaction.create({
      data: {
        userId: studentId,
        type: "class",
        debit: true,
        amount: theclass?.price!,
      },
    });
    // Create the users transaction information for teacher
    await prisma.transaction.create({
      data: {
        userId: theclass?.teacherId!,
        type: "class",
        debit: false,
        amount: theclass?.price!,
      },
    });
    // now we update the wallet of the owner of the class as required
    await BalanceAddition(Number(theclass?.price), theclass?.teacherId!);
    return new Response(
      JSON.stringify({
        message: "payment successful and student added in class",
      }),
      { status: 200 }
    );
  } catch (error) {
    return serverError();
  }
};

// here we make payment for session
export const sessionPaymentFlutter = async (paymentInfo: any) => {
  // lets check if the registraction is from the parents first,
  // if it is, then we get the childs id and use it for creating this session
  let wardId: string;
  if (paymentInfo.byparents) {
    const student = await prisma.student.findFirst({
      where: { studentId: paymentInfo.studentId },
      select: {
        id: true,
      },
    });
    wardId = student?.id as string;
  }
  try {
    await prisma.adminSectionView.create({
      data: {
        studentId: paymentInfo.byparents ? wardId! : paymentInfo.studentId,
        oneOnOneSectionId: paymentInfo.selectedTeacher,
        merged: false,
        amt: Number(paymentInfo.price),
        sectionType: paymentInfo.sessionType,
        hoursperday: paymentInfo.hours ? Number(paymentInfo.hours) : 2,
        duration: paymentInfo.length,
        subject: paymentInfo.subjects.split("-"),
        curriculum: paymentInfo.curriculum,
        specialNeed: paymentInfo.specialNeeds.split("-"),
        learningGoal: paymentInfo.goals,
        learningDays: paymentInfo.days.split("-"),
        startTime: paymentInfo.classStart,
        grade: paymentInfo.grade,
      },
    });
    return new Response(JSON.stringify({ message: "successful" }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return serverError();
  }
};
export const sessionPaymentPaystack = async (paymentInfo: any) => {
  // lets check if the registraction is from the parents first,
  // if it is, then we get the childs id and use it for creating this session
  let wardId: string;
  let parentsId: string;
  if (paymentInfo.byparents) {
    const student = await prisma.student.findFirst({
      where: { studentId: paymentInfo.studentId },
      select: {
        id: true,
        parentsId: true,
      },
    });
    wardId = student?.id as string;
    parentsId = student?.parentsId as string;
  }
  try {
    await prisma.adminSectionView.create({
      data: {
        studentId: paymentInfo.byparents ? wardId! : paymentInfo.studentId,
        oneOnOneSectionId: paymentInfo.selectedTeacher,
        merged: false,
        amt: Number(paymentInfo.price),
        sectionType: paymentInfo.sessionType,
        hoursperday: paymentInfo.hours ? paymentInfo.hours : 2,
        duration: paymentInfo.length,
        subject: paymentInfo.subjects,
        curriculum: paymentInfo.curriculum,
        specialNeed: paymentInfo.specialNeeds,
        learningGoal: paymentInfo.goals,
        learningDays: paymentInfo.days,
        startTime: paymentInfo.classStart,
        grade: paymentInfo.grade,
      },
    });
    // create a transaction record for the user below
    // check if the payment was made by the parents or student
    if (paymentInfo.byparents) {
      await prisma.transaction.create({
        data: {
          userId: parentsId!,
          type: "session",
          debit: true,
          amount: Number(paymentInfo.price),
        },
      });
    } else {
      await prisma.transaction.create({
        data: {
          userId: paymentInfo.studentId,
          type: "session",
          debit: true,
          amount: Number(paymentInfo.price),
        },
      });
    }
    return new Response(JSON.stringify({ message: "successful" }), {
      status: 200,
    });
  } catch (error) {
    return serverError();
  }
};

enum IPlan {
  FREE,
  BASIC,
  PRO,
}
// here we write the function for teacher webhook subscription for flutterwave
interface Iplans {
  __CheckoutInitAddress?: string;
  userId: string;
  amt: number;
  duration: string;
  expireIn: string;
  plan: any;
}
export const teachersPlan = async (payload: Iplans) => {
  const newDate = new Date();
  // time to track when plan was created and for crons job to delete based on the unix epoch timestamp
  const duedate = newDate.getTime(); //epoch time in milliseconds
  // here we will create an epoch time
  // this will show the plan expiration date
  // then converts back to isoDateString
  const expireTime =
    newDate.getTime() + 1000 * 60 * 60 * 24 * 31 * Number(payload.expireIn);
  const expireIn = new Date(expireTime).toISOString();
  try {
    // here we can now create the plan based on the teacher that made the payment
    await prisma.teachersPlans.update({
      where: {
        teacherId: payload.userId,
      },
      data: {
        amt: Number(payload.amt),
        dueDate: duedate,
        expireDate: expireIn,
        plan: payload.plan,
      },
    });
    // we can go on and create the transaction records as required
    await prisma.transaction.create({
      data: {
        type: "teacherplan",
        amount: Number(payload.amt),
        userId: payload.userId,
        debit: true,
      },
    });
    return new Response(
      JSON.stringify({ message: "subscription was successful" }),
      { status: 200 }
    );
  } catch (error) {
    return serverError();
  }
};

// here we will handle the webhook for student paying for a course
interface Icourses {
  __CheckoutInitAddress?: string;
  courseId: string;
  payerId: string;
  userType: string;
}
export const coursePayment = async (payload: Icourses) => {
  // first, let's get the course that we want to buy or purchase
  const theCourse = await prisma.courses.findUnique({
    where: { id: payload.courseId },
    include: {
      teacher: {
        select: {
          name: true,
          profilePhoto: true,
          status: true,
          id: true,
        },
      },
    },
  });
  // checking if course actually exists or if the user has the course already
  if (!theCourse) return;
  const alreadyBought = theCourse.buyersList.includes(payload.payerId);
  if (alreadyBought) return;
  try {
    // check if isStudent is true and buy the course for the student or
    // buy the course for the parents if the student is false
    if (payload.userType === "Student") {
      await prisma.studentPurchasedCourses.create({
        data: {
          coursesId: payload.courseId,
          title: theCourse?.title,
          price: theCourse?.price,
          byAdmin: theCourse?.byAdmin,
          subject: theCourse?.subject,
          banner: theCourse?.banner,
          previewVideo: theCourse?.previewVideo,
          mainVideo: theCourse?.mainVideo,
          studentId: payload.payerId,
          CourseInfo: {
            teacher: {
              id: theCourse.teacherId,
              name: theCourse.teacher.name!,
              status: theCourse.teacher.status,
              profilePhoto: theCourse.teacher.profilePhoto,
            },
          },
        },
      });
      // create transaction records for the student
      await prisma.transaction.create({
        data: {
          type: "courses",
          amount: theCourse?.price,
          debit: true,
          userId: payload.payerId,
        },
      });
      // Create the users transaction information for teacher
      await prisma.transaction.create({
        data: {
          userId: theCourse.teacherId,
          type: "class",
          debit: false,
          amount: theCourse?.price,
        },
      });
      // add money to the teachers wallet
      await BalanceAddition(theCourse.price, theCourse.teacherId);
    } else if (payload.userType === "Parents") {
      await prisma.parentsPurchasedCourses.create({
        data: {
          coursesId: payload.courseId,
          title: theCourse?.title,
          price: theCourse?.price,
          byAdmin: theCourse?.byAdmin,
          subject: theCourse?.subject,
          banner: theCourse?.banner,
          previewVideo: theCourse?.previewVideo,
          mainVideo: theCourse?.mainVideo,
          parentsId: payload.payerId,
          CourseInfo: {
            teacher: {
              id: theCourse.teacherId,
              name: theCourse.teacher.name!,
              status: theCourse.teacher.status,
              profilePhoto: theCourse.teacher.profilePhoto,
            },
          },
        },
      });
      // create transaction records for the parents
      await prisma.transaction.create({
        data: {
          type: "courses",
          amount: theCourse?.price,
          debit: true,
          userId: payload.payerId,
        },
      });
      // Create the users transaction information for teacher
      await prisma.transaction.create({
        data: {
          userId: theCourse.teacherId,
          type: "class",
          debit: false,
          amount: theCourse?.price,
        },
      });
      // add money to the teachers wallet
      await BalanceAddition(theCourse.price, theCourse.teacherId);
    } else {
      await prisma.teacherPurchasedCourses.create({
        data: {
          coursesId: payload.courseId,
          title: theCourse?.title,
          price: theCourse?.price,
          byAdmin: theCourse?.byAdmin,
          subject: theCourse?.subject,
          banner: theCourse?.banner,
          previewVideo: theCourse?.previewVideo,
          mainVideo: theCourse?.mainVideo,
          teacherId: payload.payerId,
          CourseInfo: {
            teacher: {
              id: theCourse.teacherId,
              name: theCourse.teacher.name!,
              status: theCourse.teacher.status,
              profilePhoto: theCourse.teacher.profilePhoto,
            },
          },
        },
      });
      // create transaction records for the teacher
      await prisma.transaction.create({
        data: {
          type: "courses",
          amount: theCourse?.price,
          debit: true,
          userId: payload.payerId,
        },
      });
      // Create the users transaction information for teacher
      await prisma.transaction.create({
        data: {
          userId: theCourse.teacherId,
          type: "class",
          debit: false,
          amount: theCourse?.price,
        },
      });
      // add money to the teachers wallet
      await BalanceAddition(theCourse.price, theCourse.teacherId);
    }
    // now, update the course total sell by one
    await prisma.courses.update({
      where: { id: payload.courseId },
      data: {
        sellCount: theCourse.sellCount + 1,
        buyersList: { push: payload.payerId },
      },
    });
    // then we go ahead and add this to the revenew generated so far
    await prisma.revenew.create({
      data: {
        amt: theCourse.price,
        teacherId: theCourse.teacherId,
        type: "Course",
      },
    });
    return new Response(
      JSON.stringify({ message: "Course bought successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return serverError();
  }
};

// this part registers the special request in the database
// after payment
interface ISpecialRequest {
  parentsId: string;
  studentId: string;
  amt: number;
  language: string;
  subject: string;
  grade: string;
  time: string;
  kindOfTeacher: string;
}
export const specialRequest = async (payload: ISpecialRequest) => {
  try {
    await prisma.specialTeacherUnmerged.create({
      data: {
        parentsId: payload.parentsId,
        studentId: payload.studentId,
        amt: Number(payload.amt),
        language: payload.language,
        subject: payload.subject,
        grade: payload.grade,
        time: payload.time,
        kindOfTeacher: payload.kindOfTeacher,
      },
    });
    // create transaction records for the parent after paying for special request
    await prisma.transaction.create({
      data: {
        type: "courses",
        amount: Number(payload.amt),
        debit: true,
        userId: payload.parentsId,
      },
    });
    return new Response(JSON.stringify({ message: "successfull" }), {
      status: 200,
    });
  } catch (error) {
    return serverError();
  }
};
