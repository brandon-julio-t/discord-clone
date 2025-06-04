import type { User } from "better-auth";
import { useSearchParams } from "next/navigation";
import React from "react";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Skeleton } from "~/components/ui/skeleton";
import { useAllChannelsShape } from "~/domains/channel/electric-sql-shapes";
import { ChannelChatSection } from "./chat-section";

export const ChannelMainSection: React.ComponentType<{
  user: User;
}> = ({ user }) => {
  const searchParams = useSearchParams();

  const channelId = searchParams.get("channelId");

  const { data, isLoading } = useAllChannelsShape();

  const channel = data.find((channel) => channel.id === channelId);

  return (
    <main className="flex h-screen flex-1 flex-col">
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

      {channelId && channel && (
        <ChannelChatSection channelId={channelId} user={user} />
      )}
    </main>
  );
};
