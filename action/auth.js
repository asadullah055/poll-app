"use server";

import cloudinary from "@/lib/cloudinary";
import { loginSchema, userSchema } from "@/lib/definitions";
import { createSession, deleteSession } from "@/lib/session";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
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
      // Convert File to Base64
      const arrayBuffer = await profileImage.arrayBuffer();
      const base64String = Buffer.from(arrayBuffer).toString("base64");
      const dataUri = `data:${profileImage.type};base64,${base64String}`;

      // Upload the image to Cloudinary
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

  const { email, password, remember } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { errors: { auth: ["Invalid email or password"] } };
    }

    const totalPollsCreated = await prisma.poll.count({
      select: { createById: true },
    });
    const totalPollsVote = await prisma.poll.count({
      select: { votersId: true },
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
    console.error("Login error:", error);
    return { errors: { server: ["Internal server error"] } };
  }
}

/* export async function userInfo (id) {
  const user = await prisma.user.findUnique({where:id},);
  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }
  const totalPollsCreated = await Poll.countDocuments({ creator: user._id });
  const totalPollsVote = await Poll.countDocuments({ voters: user._id });
  const totalBookmarkedPolls = user.bookmarkedPolls.length;
  try {
    const userInfo = {
      ...user.toObject(),
      totalPollsCreated,
      totalPollsVote,
      totalBookmarkedPolls,
    };
    res.status(200).json(userInfo);
  } catch (err) {
    res.status(500).json({
      message: "Error login user",
      error: err.message,
    });
  }
}; */

export async function logout() {
  await deleteSession();
  redirect("/login");
}
