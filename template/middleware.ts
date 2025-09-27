// import { auth } from "@/auth"

import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "./route";
const { auth } = NextAuth(authConfig);
import { AppRouteHandlerFn } from "next/dist/server/route-modules/app-route/module";

export default auth((req) => {
  //   const isLoggedIn= !!req.auth // adding !! makes it an boolean variable
  //   console.log("ROUTE- ",req.nextUrl.pathname);
  //   console.log("Is Logged in ",isLoggedIn)

  const { nextUrl } = req;
  const isLoggedin = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  const isPublicRoute = publicRoutes.some((route) => {
    if (typeof route === "string") {
      return nextUrl.pathname === route;
    }
    if (route instanceof RegExp) {
      return route.test(nextUrl.pathname);
    }
    return false;
  });
  // checking weather the url is among the publicRoutes we will always allow this public routes

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return undefined;
    // auth - next auth routes always allow them
  }

  if (isAuthRoute) {
    if (isLoggedin) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return undefined;
  }

  // ✅ Allow public routes (exact + regex)
  if (isPublicRoute) {
    return undefined;
  }

  // ✅ Protect everything else
  if (!isLoggedin) {
    if (nextUrl.pathname === "/dashboard") {
      return Response.redirect(new URL("/auth/login", nextUrl));
    }
  }

  return undefined;
}) as AppRouteHandlerFn;

//  we will be using the route path + isLoggedin Paramater to determine what has to be done with
// the Current Route on which the user in RN

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
