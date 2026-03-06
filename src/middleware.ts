import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAuthRoute = nextUrl.pathname.startsWith("/auth");
  const isDashboardRoute =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/tasks") ||
    nextUrl.pathname.startsWith("/profile") ||
    nextUrl.pathname.startsWith("/settings") ||
    nextUrl.pathname.startsWith("/wallet") ||
    nextUrl.pathname.startsWith("/referrals") ||
    nextUrl.pathname.startsWith("/activate") ||
    nextUrl.pathname.startsWith("/withdraw") ||
    nextUrl.pathname.startsWith("/admin");

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
    "/wallet/:path*",
    "/referrals/:path*",
    "/activate/:path*",
    "/withdraw/:path*",
    "/admin/:path*",
    "/auth/:path*",
  ],
};
