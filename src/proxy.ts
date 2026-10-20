import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, isAccessConfigured, verifySession } from "@/lib/access-gate";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/login" || pathname === "/api/access/login" || pathname === "/SKODA-LOGO.png") {
    return NextResponse.next();
  }
  if (!isAccessConfigured()) {
    return new NextResponse("RISE Hub access is not configured.", { status: 503 });
  }
  if (await verifySession(request.cookies.get(COOKIE_NAME)?.value)) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
