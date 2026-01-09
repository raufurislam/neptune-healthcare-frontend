import { Route } from "next";
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

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  console.log("pathname", request.nextUrl.pathname);

  return NextResponse.next();
}

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

export const config = {
  matcher: "/about/:path*",
};
