import { useShape } from "@electric-sql/react";
import type { Channel } from "@prisma/client";
import { env } from "~/env";

export function useAllChannelsShape() {
  return useShape<Channel>({
    url: `${env.NEXT_PUBLIC_APP_URL}/api/electric-sql`,
    params: {
      table: `"Channel"`,
    },
  });
}
