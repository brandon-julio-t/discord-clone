import { HashIcon, MoreHorizontalIcon, PenIcon, TrashIcon } from "lucide-react";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { SidebarMenuAction } from "~/components/ui/sidebar";

import type { Channel } from "@prisma/client";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";
import { EditChannelForm } from "./edit-channel-form";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useSearchParams } from "next/navigation";

export const ChannelSidebarMenuItem: React.ComponentType<{
  channel: Channel;
}> = ({ channel }) => {
  const searchParams = useSearchParams();

  const channelId = searchParams.get("channelId");

  const [openEditChannelDialog, setOpenEditChannelDialog] =
    React.useState(false);
  const [openDeleteChannelAlertDialog, setOpenDeleteChannelAlertDialog] =
    React.useState(false);

  const deleteChannelMutation = api.channel.deleteChannel.useMutation({
    onSuccess: () => {
      toast.success("Channel deleted");
      setOpenDeleteChannelAlertDialog(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete channel", {
        description: "Please try again.",
      });
    },
  });

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={channel.id === channelId} asChild>
        <Link
          href={{
            pathname: "/",
            query: { channelId: channel.id },
          }}
        >
          <HashIcon />
          <span>{channel.name}</span>
        </Link>
      </SidebarMenuButton>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction>
            <MoreHorizontalIcon />
          </SidebarMenuAction>
        </DropdownMenuTrigger>

        <AlertDialog
          open={openDeleteChannelAlertDialog}
          onOpenChange={setOpenDeleteChannelAlertDialog}
        >
          <DropdownMenuContent side="right" align="start">
            <DropdownMenuItem onClick={() => setOpenEditChannelDialog(true)}>
              <PenIcon />
              <span>Edit Channel</span>
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem variant="destructive">
                <TrashIcon />
                <span>Delete Channel</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete channel <span className="font-bold">{channel.name}</span>
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteChannelMutation.isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteChannelMutation.mutate({ id: channel.id })}
                disabled={deleteChannelMutation.isPending}
              >
                {deleteChannelMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog
          open={openEditChannelDialog}
          onOpenChange={setOpenEditChannelDialog}
        >
          <DialogContent>
            <EditChannelForm
              initialValues={channel}
              onSuccess={() => setOpenEditChannelDialog(false)}
              onCancel={() => setOpenEditChannelDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};
