import { useShape } from "@electric-sql/react";
import type { User as PrismaUser } from "@prisma/client";
import { env } from "~/env";

export function useAllUsersShape() {
  return useShape<PrismaUser>({
    url: `${env.NEXT_PUBLIC_APP_URL}/api/electric-sql`,
    params: {
      table: `user`,
    },
  });
}
