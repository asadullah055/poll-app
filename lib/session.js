import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import "server-only";
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;
// const secretKey = process.env.SESSION_SECRET;

export async function encrypt(payload, expire, secretKey) {
  const encodedKey = new TextEncoder().encode(secretKey);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expire)
    .sign(encodedKey);
}

export async function decrypt(session, secretKey) {
  const encodedKey = new TextEncoder().encode(secretKey);
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {    
    console.log("Failed to verify session");
  }
}

export async function createSession(userId) {
  const expiresAt = new Date(Date.now() + 60 * 1000); // 3 hours
  const RExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const accessToken = await encrypt(
    { userId, expiresAt }, // Access token payload
    expiresAt,
    ACCESS_SECRET
  );

  const refreshToken = await encrypt(
    { userId, expiresAt: RExpiresAt }, // Use RExpiresAt for refresh token
    RExpiresAt,
    REFRESH_SECRET
  );

  const cookieStore = await cookies();
  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    expires: RExpiresAt,
    sameSite: "lax",
    path: "/",
  }); 
}


export async function renewToken(req) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    console.log("No refresh token found.");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secretKey = new TextEncoder().encode(REFRESH_SECRET);
    const { payload } = await jwtVerify(refreshToken, secretKey, {
      algorithms: ["HS256"],
    });

    if (!payload.expiresAt || new Date(payload.expiresAt) < new Date()) {
      console.log("Refresh token has expired.");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Generate a new access token
    const accessSecretKey = new TextEncoder().encode(ACCESS_SECRET);
    const newAccessToken = await new SignJWT({ userId: payload.userId })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(accessSecretKey);
      
       // Create response with updated access token cookie
    const response = NextResponse.next();
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}



export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}
