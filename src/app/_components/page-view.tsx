"use client";

import type { User } from "better-auth";
import {
  ChevronsUpDownIcon,
  CommandIcon,
  LogOutIcon,
  PlusIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
} from "~/components/ui/sidebar";
import { useAllChannelsShape } from "~/domains/channel/electric-sql-shapes";
import { useIsMobile } from "~/hooks/use-mobile";
import { authClient } from "~/lib/auth-client";
import { CreateChannelForm } from "./channel/create-channel-form";
import { ChannelMainSection } from "./channel/main-section";
import { ChannelSidebarMenuItem } from "./channel/sidebar-menu-item";

export const PageView: React.ComponentType<{
  user: User;
}> = ({ user }) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = React.useState(false);

  const [openCreateChannelDialog, setOpenCreateChannelDialog] =
    React.useState(false);

  const { data, isLoading } = useAllChannelsShape();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <CommandIcon className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Slack Clone</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Channels</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Dialog
                    open={openCreateChannelDialog}
                    onOpenChange={setOpenCreateChannelDialog}
                  >
                    <DialogTrigger asChild>
                      <SidebarMenuButton>
                        <PlusIcon />
                        <span>New Channel</span>
                      </SidebarMenuButton>
                    </DialogTrigger>
                    <DialogContent>
                      <CreateChannelForm
                        onSuccess={() => setOpenCreateChannelDialog(false)}
                        onCancel={() => setOpenCreateChannelDialog(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </SidebarMenuItem>

                {isLoading
                  ? Array.from({ length: 10 }).map((_, index) => (
                      <SidebarMenuSkeleton key={index} />
                    ))
                  : data.map((item) => (
                      <ChannelSidebarMenuItem key={item.id} channel={item} />
                    ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user.image ?? ""} alt={user.name} />
                      <AvatarFallback className="rounded-lg">
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.name}
                      </span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                    <ChevronsUpDownIcon className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user.image ?? ""} alt={user.name} />
                        <AvatarFallback className="rounded-lg">
                          {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user.name}
                        </span>
                        <span className="truncate text-xs">{user.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      await authClient.signOut();
                      router.push("/auth/login");
                    }}
                  >
                    <LogOutIcon />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <ChannelMainSection user={user} />
      </SidebarInset>
    </SidebarProvider>
  );
};
