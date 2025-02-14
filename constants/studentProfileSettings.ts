"use client";

import { z } from "zod";

// below is the zod schema for students that updates their profiles

export const studentProfileSettingsSchema = z.object({
  name: z.string().min(3, { message: "name is required" }),
  email: z.string().min(3, { message: "email is required" }),
  grade: z.string().min(1, { message: "field required" }),
  phoneNo: z.string().min(3, { message: "Phone Number is required" }),
  address: z.string().min(3, { message: "address is required" }),
  gender: z.enum(["Male", "Female"], {
    message: "you can only enter male or female as gender",
  }),
});
