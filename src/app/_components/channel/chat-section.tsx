import { zodResolver } from "@hookform/resolvers/zod";
import { matchBy, matchStream } from "@electric-sql/experimental";
import { ulid } from "ulid";
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
import { useAllChannelMessagesShape } from "~/domains/message/electric-sql-shapes";
import { createMessageSchema } from "~/domains/message/schema";
import { api } from "~/trpc/react";
import { ChannelMessageChatItem } from "../channel-message/chat-item";
import { Skeleton } from "~/components/ui/skeleton";
import { useVirtualizer } from "@tanstack/react-virtual";

export const ChannelChatSection: React.ComponentType<{
  channelId: string;
  user: User;
}> = ({ channelId, user }) => {
  const messagesShape = useAllChannelMessagesShape({ channelId });

  const [optimisticMessages, addOptimisticMessage] = React.useOptimistic<
    typeof messagesShape.data,
    { type: "add"; message: (typeof messagesShape.data)[number] }
  >(messagesShape.data, (messages, action) => {
    switch (action.type) {
      case "add":
        return messages.some((message) => message.id === action.message.id)
          ? messages
          : [...messages, action.message];

      default:
        return messages;
    }
  });

  const parentRef = React.useRef<HTMLDivElement>(null);

  const count = optimisticMessages.length;
  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
  });

  const [shouldScrollToBottom, setShouldScrollToBottom] = React.useState(true);

  React.useEffect(
    function scrollToBottomOnNewMessageAndNotReadingOldMessage() {
      if (shouldScrollToBottom) {
        virtualizer.scrollToIndex(count - 1);
      }
    },
    [count, shouldScrollToBottom, virtualizer],
  );

  const items = virtualizer.getVirtualItems();

  const [nextId, setNextId] = React.useState(ulid());

  const form = useForm({
    resolver: zodResolver(createMessageSchema),
    values: {
      id: nextId,
      channelId,
      textContent: "",
    },
  });

  const createMessageMutation = api.message.createMessage.useMutation({
    onMutate: async (data) => {
      setNextId(ulid());

      React.startTransition(async () => {
        addOptimisticMessage({
          type: "add",
          message: {
            id: data.id,
            textContent: data.textContent,
            channelId,
            createdByUserId: user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
        });

        await matchStream(
          messagesShape.stream,
          ["insert"],
          matchBy("id", data.id),
        );
      });

      form.reset();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to send message", {
        description: "Please try again.",
      });
    },
  });

  const onSubmit = form.handleSubmit(
    (data) => {
      createMessageMutation.mutate({
        id: nextId,
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
      <section
        ref={parentRef}
        onScroll={(e) => {
          const scrollTop = e.currentTarget.scrollTop;
          const clientHeight = e.currentTarget.clientHeight;
          const scrollHeight = e.currentTarget.scrollHeight;
          const threshold = 24;
          const shouldScrollToBottom =
            scrollTop + clientHeight >= scrollHeight - threshold;

          setShouldScrollToBottom(shouldScrollToBottom);
        }}
        className="flex min-h-0 flex-1 flex-col overflow-auto contain-strict"
      >
        <div className="flex flex-1 flex-col justify-end">
          {messagesShape.isLoading ? (
            <div>
              {Array.from({ length: 10 }).map((_, idx) => (
                <Skeleton key={idx} className="m-3 h-16" />
              ))}
            </div>
          ) : !optimisticMessages.length ? (
            <div className="flex items-center justify-center py-4">
              <p className="text-muted-foreground text-sm">
                No messages yet. Be the first to send a message!
              </p>
            </div>
          ) : (
            <div
              style={{
                height: virtualizer.getTotalSize(),
                width: "100%",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${items[0]?.start ?? 0}px)`,
                }}
              >
                {items.map((virtualRow) => (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                  >
                    <ChannelMessageChatItem
                      key={optimisticMessages[virtualRow.index]!.id}
                      message={optimisticMessages[virtualRow.index]!}
                      user={user}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
                  placeholder="Send a message..."
                  className="resize-none border-none shadow-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <section className="flex justify-end">
          <Button type="submit">Send</Button>
        </section>
      </form>
    </Form>
  );
};
