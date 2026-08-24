import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: email.trim().toLowerCase() },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as Role;
      return session;
    },
    async authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      const role = auth?.user?.role;

      if (pathname.startsWith("/dashboard") || pathname.startsWith("/register/payment")) {
        if (!auth) return false;
        if (role !== "STUDENT") {
          return NextResponse.redirect(
            new URL(role === "ADMIN" ? "/admin" : "/login", request.url),
          );
        }
        return true;
      }

      if (pathname.startsWith("/admin")) {
        if (!auth) return false;
        if (role !== "ADMIN") {
          return NextResponse.redirect(
            new URL(role === "STUDENT" ? "/dashboard" : "/login", request.url),
          );
        }
        return true;
      }

      if (pathname === "/login" || pathname === "/register") {
        if (auth) {
          return NextResponse.redirect(
            new URL(role === "ADMIN" ? "/admin" : "/dashboard", request.url),
          );
        }
        return true;
      }

      return true;
    },
  },
});
