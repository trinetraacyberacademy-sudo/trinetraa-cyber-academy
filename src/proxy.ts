import type { NextRequest, NextFetchEvent } from "next/server";
import { auth } from "@/lib/auth";

// `auth` is heavily overloaded (route handler / API route / middleware / server
// action forms). Re-typed here to the exact proxy signature Next.js 16 expects,
// since TS overload resolution doesn't reliably pick the middleware overload.
const proxyAuth = auth as unknown as (
  request: NextRequest,
  event: NextFetchEvent,
) => Response | Promise<Response>;

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  return proxyAuth(request, event);
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register", "/register/payment"],
};
