import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { createChannelSchema } from "~/domains/channel/schema";
import { api } from "~/trpc/react";

export const CreateChannelForm: React.ComponentType<{
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ onSuccess, onCancel }) => {
  const form = useForm({
    resolver: zodResolver(createChannelSchema),
    defaultValues: {
      name: "",
    },
  });

  const createChannelMutation = api.channel.createChannel.useMutation({
    onSuccess: () => {
      toast.success("Channel created");
      onSuccess();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create channel", {
        description: "Please try again.",
      });
    },
  });

  const onSubmit = form.handleSubmit(
    (data) => {
      createChannelMutation.mutate(data);
    },
    (error) => {
      console.error(error);
      toast.error("Failed to create channel", {
        description: "Please try again.",
      });
    },
  );

  const id = React.useId();

  return (
    <Form {...form}>
      <DialogHeader>
        <DialogTitle>Create Channel</DialogTitle>
        <DialogDescription>
          Create a new channel to start a conversation.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={onSubmit} className="space-y-4" id={id}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>

      <DialogFooter>
        <Button
          type="submit"
          form={id}
          disabled={createChannelMutation.isPending}
        >
          {createChannelMutation.isPending ? "Creating..." : "Create"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={createChannelMutation.isPending}
        >
          Cancel
        </Button>
      </DialogFooter>
    </Form>
  );
};
