import type { User } from "better-auth";
import { useSearchParams } from "next/navigation";
import React from "react";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Skeleton } from "~/components/ui/skeleton";
import { useAllChannelsShape } from "~/domains/channel/electric-sql-shapes";
import { ChannelChatSection } from "./chat-section";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { SunIcon, MoonIcon, MonitorIcon } from "lucide-react";

export const ChannelMainSection: React.ComponentType<{
  user: User;
}> = ({ user }) => {
  const searchParams = useSearchParams();

  const channelId = searchParams.get("channelId");

  const { data, isLoading } = useAllChannelsShape();

  const channel = data.find((channel) => channel.id === channelId);

  const { setTheme } = useTheme();

  return (
    <main className="flex h-screen flex-1 flex-col">
      <header className="flex shrink-0 items-center gap-2 border-b py-2">
        <div className="flex w-full items-center gap-2 px-4 py-2">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div className="h-4">
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
          </div>

          <div className="flex-1">
            {isLoading ? (
              <Skeleton className="h-(--text-lg) w-full" />
            ) : (
              <h1 className="text-lg font-semibold">
                {channel?.name ?? "No channel selected"}
              </h1>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <SunIcon />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <MoonIcon />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <MonitorIcon />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {channelId && channel && (
        <ChannelChatSection channelId={channelId} user={user} />
      )}
    </main>
  );
};
