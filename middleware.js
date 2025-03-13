import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { renewToken } from "./lib/session";

export default async function middleware(req) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
  const path = req.nextUrl.pathname;

  const isProtectedRoute = [
    "/",
    "/create-poll",
    "/bookmarked-poll",
    "/my-polls",
    "/voted-polls",
  ].includes(path);
  const isPublicRoute = ["/login", "/signup"].includes(path);

  try {
    if (accessToken) {
      const secretKey = new TextEncoder().encode(ACCESS_SECRET);
      const { payload } = await jwtVerify(accessToken, secretKey);
      if (!payload?.userId) {
        throw new Error("Invalid token payload");
      }
      if (isPublicRoute && payload?.userId) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    if (refreshToken) {
      return await renewToken(req);
    }
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware:", error);

    if (refreshToken) {
      return await renewToken(req);
    }

    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }
}
