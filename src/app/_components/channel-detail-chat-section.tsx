import { useShape } from "@electric-sql/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ChannelMessage } from "@prisma/client";
import type { User } from "better-auth";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { createMessageSchema } from "~/domains/message/schema";
import { env } from "~/env";
import { api } from "~/trpc/react";
import { ChatItem } from "./chat-item";

export const ChannelDetailChatSection: React.ComponentType<{
  channelId: string;
  user: User;
}> = ({ channelId, user }) => {
  const messagesShape = useShape<ChannelMessage>({
    url: `${env.NEXT_PUBLIC_APP_URL}/api/electric-sql`,
    params: {
      table: `"ChannelMessage"`,
      where: `"channelId" = '${channelId}'`,
    },
  });

  const form = useForm({
    resolver: zodResolver(createMessageSchema),
    values: {
      channelId,
      textContent: "",
    },
  });

  const createMessageMutation = api.message.createMessage.useMutation({
    onSuccess: () => {
      form.reset();
      toast.success("Message sent");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to send message", {
        description: "Please try again.",
      });
    },
  });

  const onSubmit = form.handleSubmit(
    async (data) => {
      createMessageMutation.mutate({
        textContent: data.textContent,
        channelId,
      });
    },
    (error) => {
      console.error(error);
      toast.error("Failed to send message", {
        description: "Please try again.",
      });
    },
  );

  React.useEffect(
    function onCmdEnter() {
      const cmdEnter = (e: KeyboardEvent) => {
        if (e.key === "Enter" && e.metaKey) {
          void onSubmit();
        }
      };

      document.addEventListener("keydown", cmdEnter);

      return () => {
        document.removeEventListener("keydown", cmdEnter);
      };
    },
    [onSubmit],
  );

  return (
    <Form {...form}>
      <section className="flex flex-1 flex-col justify-end overflow-y-auto">
        {!messagesShape.data.length ? (
          <div className="flex items-center justify-center py-4">
            <p className="text-muted-foreground text-sm">
              No messages yet. Be the first to send a message!
            </p>
          </div>
        ) : (
          messagesShape.data.map((message) => (
            <ChatItem key={message.id} message={message} user={user} />
          ))
        )}
      </section>

      <Separator />

      <form className="flex flex-col gap-4 p-4" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="textContent"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={createMessageMutation.isPending}
                  placeholder="Send a message..."
                  className="resize-none border-none shadow-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <section className="flex justify-end">
          <Button type="submit" disabled={createMessageMutation.isPending}>
            {createMessageMutation.isPending ? "Sending..." : "Send"}
          </Button>
        </section>
      </form>
    </Form>
  );
};
