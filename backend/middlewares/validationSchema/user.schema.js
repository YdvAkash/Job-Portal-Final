import z from "zod";
export const signupSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter") // Requires at least one uppercase letter
    .regex(/[a-z]/, "Password must contain at least one lowercase letter") // Requires at least one lowercase letter
    .regex(/[0-9]/, "Password must contain at least one number"), // Requires at least one digit
  phoneNumber: z
    .string()
    .transform((val) => parseInt(val, 10)) // Convert the string to a number
    .refine((val) => !isNaN(val), {
      message: "Invalid phone number",
    }),
  role: z.enum(["applicant", "recruiter"], "Invalid role type"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.enum(["applicant", "recruiter"], "Invalid role type"),
});

export const updateProfileSchema = z.object({
  fullName: z.string().optional().or(z.literal("")),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .optional()
    .or(z.literal("")),
  phoneNumber: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  skills: z.union([z.string(), z.array(z.string())]).optional().or(z.literal("")),
  resume: z.string().optional().or(z.literal("")),
});
