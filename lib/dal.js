import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import "server-only";
import { decrypt } from "./session";
const prisma = new PrismaClient();
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("accessToken")?.value;
  const session = await decrypt(cookie, ACCESS_SECRET);

  if (!session?.userId) {
    redirect("/login");
  }
  return { isAuth: true, userId: session.userId };
});
export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await prisma.user.findMany({
      where: { id: session?.userId },
      // Explicitly return the columns you need rather than the whole user object
    });

    const user = data[0];
    return user;
  } catch (error) {
    console.log("Failed to fetch user");
    return null;
  }
});
