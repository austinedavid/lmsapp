import { z } from "zod";

// Creating the zod definition for different exam types
export const studentExamSchema = z.object({
  answeredExam: z
    .array(
      z.object({
        question: z
          .string({ message: "enter your question" })
          .min(4, { message: "enter a valid answer" }),
        answer: z.string({ message: "enter a valid answer" }).min(1, {
          message: "click beside the correct option to add the answer",
        }),
        studentAnswer: z.string({ message: "enter a valid answer" }).min(1, {
            message: "click beside the correct option to add the answer",
          }),
        option: z.array(z.string()),
      })
    ).default([{ question: "", answer: "", studentAnswer: "", option: ["", "", "", ""] }])
    .optional(), // Make it optional so one-on-one/special request exams can work
    answeredTest: z
    .array(
      z.object({
        question: z
          .string({ message: "enter your question" })
          .min(4, { message: "enter a valid answer" }),
        answer: z.string({ message: "enter a valid answer" }).min(1, {
          message: "click beside the correct option to add the answer",
        }),
        studentAnswer: z.string({ message: "enter a valid answer" }).min(1, {
            message: "click beside the correct option to add the answer",
          }),
        option: z.array(z.string()),
      })
    ).default([{ question: "", answer: "", studentAnswer: "", option: ["", "", "", ""] }])
    .optional(), // Make it optional so group exams can work
});


