import { z } from "zod";
export interface IprogressType {
  name: string;
  field: string[];
}
export const Iexam: IprogressType[] = [
  { name: "Choose Type", field: ["title", "type"] },
  { name: "Test Paper", field: ["test"] },
  { name: "Settings", field: ["grade", "duration", "start", "end"] },
  { name: "Finalization", field: [""] },
];

// creating the zod defination for the exams we have
export const examSchema = z.object({
  title: z.string().min(3, { message: "enter your exam title" }),
  type: z.string({ message: "select the exam type" }),
  test: z.array(
    z.object({
      question: z.string({ message: "enter your question" }),
      answer: z.string({ message: "enter a valid answer" }),
      obtions: z.array(z.string()),
    })
  ),
  grade: z.enum([
    "Grade1",
    "Grade2",
    "Grade3",
    "Grade4",
    "Grade5",
    "Grade6",
    "Grade7",
    "Grade8",
    "Grade9",
    "Grade10",
    "Grade11",
    "Grade12",
  ]),
  duration: z.string({ message: "enter the duration" }),
  start: z.date(),
  end: z.date(),
});
