import { z } from "zod";

export const userSchema = z
  .object({
    fullname: z.string().min(3, "Full name must be at least 3 characters long"),
    email: z.string().email("Invalid email address").trim(),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .trim(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .trim(),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
    profileImage: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  remember: z.boolean().optional(),
});
export const passwordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .trim(),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .trim(),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email address").trim(),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .trim(),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
