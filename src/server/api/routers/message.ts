import { z } from "zod";
import {
  createMessageSchema,
  updateMessageSchema,
} from "~/domains/message/schema";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const messageRouter = createTRPCRouter({
  createMessage: protectedProcedure
    .input(createMessageSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.channelMessage.create({
        data: {
          textContent: input.textContent,
          channelId: input.channelId,
          createdByUserId: ctx.session.user.id,
        },
      });
    }),

  updateMessage: protectedProcedure
    .input(updateMessageSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.channelMessage.update({
        where: {
          id: input.id,
          createdByUserId: ctx.session.user.id,
        },
        data: {
          textContent: input.textContent,
        },
      });
    }),

  deleteMessage: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.channelMessage.delete({
        where: {
          id: input.id,
          createdByUserId: ctx.session.user.id,
        },
      });
    }),
});
