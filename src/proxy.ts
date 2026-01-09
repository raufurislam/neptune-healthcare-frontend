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

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  console.log("pathname", request.nextUrl.pathname);

  return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: "/about/:path*",
};
