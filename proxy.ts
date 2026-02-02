import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Migrated from middleware.ts for Next.js 16
// Proxy runs on Node.js runtime (not Edge)
export function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // If accessing app.spout.finance, rewrite to /app routes
  if (host.startsWith("app.")) {
    // If at root of subdomain, show /app content
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/app", request.url));
    }
    // If path doesn't start with /app, prepend it
    if (!pathname.startsWith("/app") && !pathname.startsWith("/_next")) {
      return NextResponse.rewrite(new URL(`/app${pathname}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
