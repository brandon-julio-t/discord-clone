import { useShape } from "@electric-sql/react";
import type { Channel } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import React from "react";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Skeleton } from "~/components/ui/skeleton";

export const ChannelDetailSection: React.ComponentType = () => {
  const searchParams = useSearchParams();

  const channelId = searchParams.get("channelId");

  const { data, isLoading } = useShape<Channel>({
    url: "http://localhost:3001/api/electric-sql",
    params: {
      table: `"Channel"`,
      where: `"id" = '${channelId}'`,
    },
  });

  const channel = data?.at(0);

  return (
    <main className="size-full">
      <header className="flex shrink-0 items-center gap-2 border-b py-2">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div className="h-4">
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-(--text-lg) w-56" />
            ) : (
              <h1 className="text-lg font-semibold">
                {channel?.name ?? "No channel selected"}
              </h1>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </div>
    </main>
  );
};
