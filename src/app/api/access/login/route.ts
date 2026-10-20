import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, SESSION_SECONDS, createSession, isAccessConfigured, verifyPassword } from "@/lib/access-gate";

export async function POST(request: NextRequest) {
  if (!isAccessConfigured()) {
    return NextResponse.json({ error: "Access is not configured." }, { status: 503 });
  }
  let password: unknown;
  try {
    const body = await request.json();
    password = body?.password;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof password !== "string" || password.length > 256 || !(await verifyPassword(password))) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(COOKIE_NAME, await createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return response;
}
