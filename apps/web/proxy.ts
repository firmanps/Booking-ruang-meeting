import { NextResponse, type NextRequest } from "next/server";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5555").replace(/\/+$/, "");

const employeeRoutes = ["/dashboard", "/bookings", "/rooms"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requiredRole = pathname.startsWith("/admin")
    ? "ADMIN"
    : employeeRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
      ? "EMPLOYEE"
      : null;

  if (!requiredRole) return NextResponse.next();

  const accessToken = request.cookies.get("accessToken")?.value;
  if (!accessToken) return redirectToLogin(request);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { cookie: `accessToken=${accessToken}` },
      cache: "no-store",
    });

    if (response.status === 401) return redirectToLogin(request);
    if (!response.ok) return authServiceUnavailable();

    const payload: unknown = await response.json();
    const role = getRole(payload);

    if (!role) return redirectToLogin(request);
    if (role !== requiredRole) {
      const destination = role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
      return NextResponse.redirect(new URL(destination, request.url));
    }

    return NextResponse.next();
  } catch {
    return authServiceUnavailable();
  }
}

function getRole(payload: unknown): "ADMIN" | "EMPLOYEE" | null {
  if (typeof payload !== "object" || payload === null || !("user" in payload)) return null;

  const user = payload.user;
  if (typeof user !== "object" || user === null || !("role" in user)) return null;

  return user.role === "ADMIN" || user.role === "EMPLOYEE" ? user.role : null;
}

function redirectToLogin(request: NextRequest) {
  return NextResponse.redirect(new URL("/login", request.url));
}

function authServiceUnavailable() {
  return new NextResponse("Layanan autentikasi sedang tidak tersedia. Coba lagi beberapa saat lagi.", { status: 503 });
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/bookings/:path*", "/rooms/:path*"],
};
