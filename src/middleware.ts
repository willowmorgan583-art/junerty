import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAuthRoute = nextUrl.pathname.startsWith("/auth");
  const isDashboardRoute =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/tasks") ||
    nextUrl.pathname.startsWith("/profile") ||
    nextUrl.pathname.startsWith("/settings");

  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  if (isDashboardRoute && !isLoggedIn) {
    const loginUrl = new URL("/auth/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return Response.redirect(loginUrl);
  }

  return undefined;
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tasks/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/auth/:path*",
  ],
};
