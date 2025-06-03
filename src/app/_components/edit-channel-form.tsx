import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
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
import { updateChannelSchema } from "~/domains/channel/schema";
import { api } from "~/trpc/react";

export const EditChannelForm: React.ComponentType<{
  initialValues: z.infer<typeof updateChannelSchema>;
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ initialValues, onSuccess, onCancel }) => {
  const form = useForm({
    resolver: zodResolver(updateChannelSchema),
    defaultValues: initialValues,
  });

  const updateChannelMutation = api.channel.updateChannel.useMutation({
    onSuccess: () => {
      toast.success("Channel updated");
      onSuccess();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update channel", {
        description: "Please try again.",
      });
    },
  });

  const onSubmit = form.handleSubmit(
    (data) => {
      updateChannelMutation.mutate(data);
    },
    (error) => {
      console.error(error);
      toast.error("Failed to update channel", {
        description: "Please try again.",
      });
    },
  );

  const id = React.useId();

  return (
    <Form {...form}>
      <DialogHeader>
        <DialogTitle>Edit Channel</DialogTitle>
        <DialogDescription>Edit the channel name.</DialogDescription>
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
          disabled={updateChannelMutation.isPending}
        >
          {updateChannelMutation.isPending ? "Updating..." : "Update"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={updateChannelMutation.isPending}
        >
          Cancel
        </Button>
      </DialogFooter>
    </Form>
  );
};
