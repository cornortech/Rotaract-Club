import { NextResponse, type NextRequest } from "next/server";

// Quick first check for the admin area: no login cookie → go to the login page.
// The admin layout then confirms the login with the backend.
export function proxy(req: NextRequest) {
  if (!req.cookies.get("rbs_admin")?.value) return NextResponse.redirect(new URL("/adminlogin", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
