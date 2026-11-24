import { NextResponse, type NextRequest } from "next/server";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5555").replace(/\/+$/, "");
type UserRole = "ADMIN" | "EMPLOYEE";
type AuthCheckResult = { status: "ok"; role: UserRole | null } | { status: "unauthorized" | "unavailable" };

const pendingAuthChecks = new Map<string, Promise<AuthCheckResult>>();

const employeeRoutes = ["/dashboard", "/bookings", "/rooms"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isProfilePage = pathname === "/profile";
  const requiredRole = pathname.startsWith("/admin")
    ? "ADMIN"
    : employeeRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
      ? "EMPLOYEE"
      : null;

  if (!requiredRole && !isAuthPage && !isProfilePage) return NextResponse.next();

  const accessToken = request.cookies.get("accessToken")?.value;
  if (!accessToken) return isAuthPage ? NextResponse.next() : redirectToLogin(request);

  try {
    const authCheck = await checkAccessToken(accessToken);
    if (authCheck.status !== "ok") {
      if (authCheck.status === "unauthorized") return isAuthPage ? NextResponse.next() : redirectToLogin(request);
      return authServiceUnavailable();
    }

    const role = authCheck.role;

    if (isProfilePage) {
      if (role === "ADMIN" || role === "EMPLOYEE") return NextResponse.next();
      return redirectToLogin(request);
    }

    if (!role) return isAuthPage ? NextResponse.next() : redirectToLogin(request);
    if (isAuthPage) {
      const destination = role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
      return NextResponse.redirect(new URL(destination, request.url));
    }
    if (role !== requiredRole) {
      const destination = role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
      return NextResponse.redirect(new URL(destination, request.url));
    }

    return NextResponse.next();
  } catch {
    return authServiceUnavailable();
  }
}

function checkAccessToken(accessToken: string): Promise<AuthCheckResult> {
  const existing = pendingAuthChecks.get(accessToken);
  if (existing) return existing;

  const request = fetch(`${API_BASE_URL}/auth/me`, {
    headers: { cookie: `accessToken=${accessToken}` },
    cache: "no-store",
  })
    .then(async (response): Promise<AuthCheckResult> => {
      if (response.status === 401) return { status: "unauthorized" };
      if (!response.ok) return { status: "unavailable" };
      return { status: "ok", role: getRole(await response.json()) };
    })
    .catch((): AuthCheckResult => ({ status: "unavailable" }))
    .finally(() => {
      if (pendingAuthChecks.get(accessToken) === request) pendingAuthChecks.delete(accessToken);
    });

  pendingAuthChecks.set(accessToken, request);
  return request;
}

function getRole(payload: unknown): UserRole | null {
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
  matcher: ["/login", "/register", "/profile", "/admin/:path*", "/dashboard/:path*", "/bookings/:path*", "/rooms/:path*"],
};
