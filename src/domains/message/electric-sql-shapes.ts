import { useShape } from "@electric-sql/react";
import type { ChannelMessage } from "@prisma/client";
import { env } from "~/env";

export function useAllChannelMessagesShape({
  channelId,
}: {
  channelId: string;
}) {
  return useShape<ChannelMessage>({
    url: `${env.NEXT_PUBLIC_APP_URL}/api/electric-sql`,
    params: {
      table: `"ChannelMessage"`,
      where: `"channelId" = $1`,
      params: { 1: channelId },
    },
  });
}
