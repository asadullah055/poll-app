"use server";

import cloudinary from "@/lib/cloudinary";
import {
  loginSchema,
  passwordSchema,
  resetPasswordSchema,
  userSchema,
} from "@/lib/definitions";
import { emailBody } from "@/lib/emailBody";
import { sendEmail } from "@/lib/emailUtills";
import { createSession, deleteSession } from "@/lib/session";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
const prisma = new PrismaClient();
export async function signup(state, formData) {
  const validatedFields = userSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { fullname, email, username, password, profileImage } =
    validatedFields.data;

  const exitEmail = await prisma.user.findFirst({
    where: { email: email },
  });
  const exitUsername = await prisma.user.findFirst({
    where: { username: username },
  });

  if (exitEmail) {
    return { errors: { email: ["Email already exists"] } };
  }
  if (exitUsername) {
    return { errors: { username: ["Username already exists"] } };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  let profileImageUrl = null;

  if (profileImage) {
    try {
      const arrayBuffer = await profileImage.arrayBuffer();
      const base64String = Buffer.from(arrayBuffer).toString("base64");
      const dataUri = `data:${profileImage.type};base64,${base64String}`;
      const uploadResponse = await cloudinary.uploader.upload(dataUri, {
        folder: "poll_app",
      });
      profileImageUrl = uploadResponse.secure_url;
    } catch (error) {
      console.log(error);
      return { errors: { profileImage: ["Error uploading image"] } };
    }
  }

  await prisma.user.create({
    data: {
      fullname,
      email,
      username,
      password: hashedPassword,
      profileImage: profileImageUrl,
    },
  });

  return { success: true, message: "Create Account Success" };
}

export async function login(state, formData) {
  const validatedFields = loginSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { errors: { auth: ["Invalid email or password"] } };
    }

    const totalPollsCreated = await prisma.poll.count({
      where: { createById: user.id },
    });

    const totalPollsVote = await prisma.poll.count({
      where: { votersId: { has: user.id } },
    });

    const totalBookmarkedPolls = user.bookmarkedPolls.length;

    await createSession(user.id);

    return {
      success: true,
      message: "Login successful",
      user: {
        totalPollsCreated,
        totalPollsVote,
        totalBookmarkedPolls,
      },
    };
  } catch (error) {
    console.log("Login error:", error);
    return { errors: { server: ["Internal server error"] } };
  }
}
export async function updatePassword(state, formData) {
  const validatedFields = passwordSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { newPassword, oldPassword } = validatedFields.data;
  try {
    const user = await prisma.user.findUnique({
      where: { email: formData.email },
    });

    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      return { errors: { auth: ["Invalid Authentication"] } };
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email: formData.email },
      data: { password: hashedPassword },
    });
    return { success: true, message: "Password updated successfully" };
  } catch (error) {
    return { errors: { server: ["Internal server error"] } };
  }
}

export async function updateProfileImage(email, file) {
  let profileImageUrl = null;

  try {
    const formData = new FormData();
    formData.append("file", file);

    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64String}`;

    const uploadResponse = await cloudinary.uploader.upload(dataUri, {
      folder: "poll_app",
    });

    profileImageUrl = uploadResponse.secure_url;

    await prisma.user.update({
      where: { email },
      data: { profileImage: profileImageUrl },
    });
    revalidatePath("/profile");

    return { success: true, message: "Update Image Success", profileImageUrl };
  } catch (error) {
    return { success: false, errors: "Image update failed" };
  }
}
export async function sendOtp(email) {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    await sendEmail(
      user.email,
      emailBody(user.fullname, otp),
      "Reset Password Verification"
    );

    await prisma.user.update({
      where: { email: email },
      data: {
        otp: otp.toString(),
      },
    });
    const expireTime = Date.now() + 2 * 60 * 1000;
    return {
      success: true,
      message: "Email send success",
      expireTime: expireTime.toString(),
    };
  } catch (error) {
    return { success: false, message: "Somethings went wrong" };
  }
}
export async function verifyOtp(email, otp) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { otp: true, updatedAt: true },
    });
    if (!user) {
      return { success: false, message: "User not found" };
    }
    const otpExpiry = new Date(user.updatedAt.getTime() + 2 * 60 * 1000);
    const currentTime = new Date();
    if (currentTime > otpExpiry) {
      return { success: false, message: "OTP has expired" };
    }
    if (user.otp !== otp) {
      return { success: false, message: "Invalid OTP" };
    }

    await prisma.user.update({
      where: { email: email },
      data: { otp: "0" },
    });

    return { success: true, message: "OTP verification successful" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
}
export async function resetPassword(state, formData) {
  const validatedFields = resetPasswordSchema.safeParse(formData);
  console.log(validatedFields.data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  try {
    const { newPassword, email } = validatedFields.data;
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { password: true },
    });
    if (!user) {
      return { success: false, message: "User not found" };
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email: email },
      data: { password: hashedPassword },
    });

    return { success: true, message: "Reset Password success" };
  } catch (error) {
    console.log(error);

    return { success: false, message: "Something went wrong" };
  }
}

export async function logout() {
  await deleteSession();
  return { message: "Logout Success" };
}
