import { z } from "zod";
import {
  createChannelSchema,
  updateChannelSchema,
} from "~/domains/channel/schema";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const channelRouter = createTRPCRouter({
  createChannel: protectedProcedure
    .input(createChannelSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.channel.create({
        data: {
          name: input.name,
        },
      });
    }),

  updateChannel: protectedProcedure
    .input(updateChannelSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.channel.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),

  deleteChannel: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.channel.delete({
        where: { id: input.id },
      });
    }),
});
