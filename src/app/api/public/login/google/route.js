import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
);

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    // Step 1: If no code, redirect to Google OAuth consent screen
    const url = client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    });
    return NextResponse.redirect(url);
  } else {
    try {
      // Step 2: Get tokens using the code from Google
      const { tokens } = await client.getToken(code);
      client.setCredentials(tokens);

      // Step 3: Retrieve user info from Google
      const userInfoResponse = await client.request({
        url: "https://www.googleapis.com/oauth2/v3/userinfo",
      });

      const userInfo = userInfoResponse.data;

      // Step 4: Retrieve the user from the database using email (assuming email is unique)
      const user = await prisma.user.findUnique({
        where: { email: userInfo.email },
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found in database." },
          { status: 404 }
        );
      }

      // Step 5: Create a JWT token for the user
      const token = await new SignJWT({
        id: user.id,
        email: user.email,
        name: user.name,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h") // Expire in 2 hours
        .sign(SECRET_KEY);

      // Step 6: Set the JWT token and user info in cookies
      const response = NextResponse.redirect("http://localhost:3000"); // Redirect to your app

      // Set cookies: auth_token, user_name, user_picture, user_id
      response.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 86400, // 1 day
      });

      response.cookies.set("user_name", user.name, {
        httpOnly: false, // This can be accessed on the client side
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 86400, // 1 day
      });

      response.cookies.set("user_picture", userInfo.picture, {
        httpOnly: false, // This can be accessed on the client side
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 86400, // 1 day
      });

      response.cookies.set("user_id", user.id.toString(), {
        httpOnly: false, // This can be accessed on the client side
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 86400, // 1 day
      });

      return response;
    } catch (error) {
      console.error("Error during Google authentication:", error);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 400 }
      );
    }
  }
}
