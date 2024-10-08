"use server";

import { cookies } from "next/headers";

interface LoginResult {
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse {
  Message: string;
  accessToken?: string;
  refreshToken?: string;
}

export async function login(formData: FormData): Promise<LoginResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const response = await fetch("http://localhost:8082/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return { Message: "Login failed" };
  }

  const result: LoginResult = await response.json();
  console.log("Login result:", result);

  cookies().set("access_token", result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  cookies().set("refresh_token", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return {
    Message: "Login successful",
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  };
}
