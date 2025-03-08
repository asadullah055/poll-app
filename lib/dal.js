"use server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { decrypt } from "./session";
const prisma = new PrismaClient();
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("accessToken")?.value;
  const session = await decrypt(cookie, ACCESS_SECRET);
  console.log("session.userId", session.userId);

  if (!session?.userId) {
    redirect("/login");
  }
  return { isAuth: true, userId: session.userId };
});
export const getUser = cache(async () => {
  const session = await verifySession();
  console.log("session", session);

  if (!session?.userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session?.userId },
      omit: { password: true },
    });
    const totalPollsCreated = await prisma.poll.count({
      select: { createById: true },
    });
    const totalPollsVote = await prisma.poll.count({
      select: { votersId: true },
    });

    const totalBookmarkedPolls = user.bookmarkedPolls.length;
    return {
      user,
      totalPollsCreated,
      totalPollsVote,
      totalBookmarkedPolls,
    };
  } catch (error) {
    console.log("Failed to fetch user", error);
    return null;
  }
});
