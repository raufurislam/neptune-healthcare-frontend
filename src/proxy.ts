import { jwtDecode } from "jwt-decode";
import { NextResponse, NextRequest } from "next/server";

interface userInterface {
  id: string;
  email: string;
  role: "ADMIN" | "DOCTOR" | "PATIENT";
  exp: number;
  iat: number;
}

const roleBasedRoutes = {
  ADMIN: [
    "/admin/dashboard",
    "/admin/manage-doctors",
    "/admin/manage-patients",
  ],
  DOCTOR: ["/doctor/dashboard"],
  PATIENT: [
    "/patient/dashboard",
    "/patient/appointments",
    "/patient/medical-records",
  ],
};

const authRoutes = ["/login", "/register", "/forgot-password"];

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;

  if (!accessToken && !refreshToken && !authRoutes.includes(pathname)) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${pathname}`, request.url)
    );
  }

  let user: userInterface | null = null;

  if (accessToken) {
    try {
      user = jwtDecode(accessToken);
      console.log({ proxyts: user });
    } catch (err) {
      console.log("Error decoding access token: ", err);
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, request.url)
      );
    }
  }

  // if()

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/forgot-password"],
};
