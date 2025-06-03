import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { db } from "~/server/db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
  },
});

export const getAuthServerSession = React.cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export const ensureAuthServerSession = React.cache(async () => {
  const session = await getAuthServerSession();
  if (!session?.user) {
    redirect("/auth/login");
  }
  return session;
});
