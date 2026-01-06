import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";



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
