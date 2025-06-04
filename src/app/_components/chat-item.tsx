import { useShape } from "@electric-sql/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ChannelMessage, User as PrismaUser } from "@prisma/client";
import type { User as BetterAuthUser } from "better-auth";
import { CheckIcon, PencilIcon, TrashIcon, XIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { updateMessageSchema } from "~/domains/message/schema";
import { env } from "~/env";
import { api } from "~/trpc/react";

export const ChatItem: React.ComponentType<{
  message: ChannelMessage;
  user: BetterAuthUser;
}> = ({ message, user }) => {
  const usersShape = useShape<PrismaUser>({
    url: `${env.NEXT_PUBLIC_APP_URL}/api/electric-sql`,
    params: {
      table: `user`,
      where: `"id" = '${message.createdByUserId}'`,
    },
  });

  const isMe = message.createdByUserId === user.id;

  const messageUser = isMe ? user : usersShape.data.at(0);

  const [isEditing, setIsEditing] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(updateMessageSchema),
    values: {
      id: message.id,
      channelId: message.channelId,
      textContent: message.textContent,
    },
  });

  const updateMessageMutation = api.message.updateMessage.useMutation({
    onSuccess: () => {
      toast.success("Message updated");
      setIsEditing(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update message", {
        description: "Please try again later.",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    updateMessageMutation.mutate(data);
  });

  const deleteMessageMutation = api.message.deleteMessage.useMutation({
    onSuccess: () => {
      toast.success("Message deleted");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete message", {
        description: "Please try again later.",
      });
    },
  });

  return (
    <div className="hover:bg-muted/50 flex flex-row gap-2 p-3">
      <Avatar>
        <AvatarImage src={messageUser?.image ?? ""} />
        <AvatarFallback>
          {messageUser?.name?.charAt(0).toUpperCase() ?? "?"}
        </AvatarFallback>
      </Avatar>

      <div className="group relative flex w-full flex-col gap-2">
        <section className="flex flex-row flex-wrap items-baseline gap-2">
          <p className="text-primary text-sm leading-(--text-base)">
            {messageUser?.name}
          </p>

          <p className="text-muted-foreground text-xs leading-(--text-base)">
            {new Date(message.createdAt).toLocaleString(undefined, {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </section>

        <Form {...form}>
          <section className="flex flex-col gap-2 rounded-lg text-sm whitespace-pre-wrap">
            {isEditing ? (
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="textContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={updateMessageMutation.isPending}
                          className="resize-none border-none shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
            ) : (
              message.textContent
            )}
          </section>
        </Form>

        {isMe && (
          <section className="text-muted-foreground absolute top-0 right-0 hidden flex-row group-hover:flex [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none">
            {isEditing ? (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => {
                    setIsEditing(false);
                    form.reset();
                  }}
                  disabled={updateMessageMutation.isPending}
                >
                  <XIcon />
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  onClick={onSubmit}
                  disabled={updateMessageMutation.isPending}
                >
                  <CheckIcon />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  disabled={deleteMessageMutation.isPending}
                >
                  <PencilIcon />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      disabled={deleteMessageMutation.isPending}
                    >
                      <TrashIcon />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your message.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        disabled={deleteMessageMutation.isPending}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        disabled={deleteMessageMutation.isPending}
                        onClick={() =>
                          deleteMessageMutation.mutate({ id: message.id })
                        }
                      >
                        {deleteMessageMutation.isPending
                          ? "Deleting..."
                          : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
};
