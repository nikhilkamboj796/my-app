import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("next-auth.session-token")?.value;

  const pathname = req.nextUrl.pathname;

  const authRoutes = ["/signup", "/login"]; // Routes only accessible when NOT logged in
  const protectedRoutes = ["/protected"]; // Routes only accessible when logged in

  const isAuthRoute = authRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.includes(pathname);

  if (isProtectedRoute && !token) {
    // Redirect to login if trying to access a protected route without a token
    const url = req.nextUrl.clone();
    url.pathname = "/login"; // Or wherever your login page is
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && token) {
    // Redirect to a different page (e.g., home) if trying to access auth routes while logged in
    const url = req.nextUrl.clone();
    url.pathname = "/"; // Or wherever you want to redirect logged-in users
    return NextResponse.redirect(url);
  }

  return NextResponse.next(); // Allow access if conditions are met
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next).*)"], // Match all routes except API, static files, etc.
};
