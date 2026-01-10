import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type UserRole = "ADMIN" | "DOCTOR" | "PATIENT";

// exact : ["/my-profile", "/settings"]
// pattern : [/^\/dashboard/, /^\/patient/], // Routes stating with /dashboard or /patient
type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};

const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "reset-password",
];

const commonProtectedRoutes: RouteConfig = {
  exact: ["/my-profile", "settings"],
  pattern: [], // [/password/change-password, /password/reset-password => /password/*]
};

const doctorProtectedRoutes: RouteConfig = {
  pattern: [/^\/doctor/], // Routes starting with /doctor/* , /assistants, /appointments/*
  exact: [], // assistants
};

const adminProtectedRoutes: RouteConfig = {
  pattern: [/^\/admin/], // Routes starting with /admin/*
  exact: [], // "/admins"
};

const patientProtectedRoutes: RouteConfig = {
  pattern: [/^\/dashboard/], // Routes starting with /dashboard/*
  exact: [], // "/medical-records"
};

const isAuthRoute = (pathname: string) => {
  return authRoutes.some((route: string) => route === pathname);
};

const isRoutesMatches = (pathname: string, routes: RouteConfig): boolean => {
  if (routes.exact.includes(pathname)) {
    return true;
  }

  return routes.pattern.some((pattern: RegExp) => pattern.test(pathname));
  // if pathname === /dashboard/my-appointments => matches /^\/dashboard/ => true
};

const getRouteOwner = (
  pathname: string
): "ADMIN" | "DOCTOR" | "PATIENT" | "COMMON" | null => {
  if (isRoutesMatches(pathname, adminProtectedRoutes)) {
    return "ADMIN";
  }
  if (isRoutesMatches(pathname, doctorProtectedRoutes)) {
    return "DOCTOR";
  }
  if (isRoutesMatches(pathname, patientProtectedRoutes)) {
    return "PATIENT";
  }
  if (isRoutesMatches(pathname, commonProtectedRoutes)) {
    return "COMMON";
  }
  return null;
};

const getDefaultDashboardRoute = (role: UserRole): string => {
  if (role === "ADMIN") {
    return "/admin/dashboard";
  }
  if (role === "DOCTOR") {
    return "/doctor/dashboard";
  }
  if (role === "PATIENT") {
    return "/dashboard";
  }
  return "/";
};

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get("accessToken")?.value || null;

  let userRole: UserRole | null = null;
  if (accessToken) {
    const verifiedToken: JwtPayload | string = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string
    );

    if (typeof verifiedToken === "string") {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    userRole = verifiedToken.role;
  }

  console.log(userRole);

  return NextResponse.next();
}

export const config = {
  matcher: "/about/:path*",
};
