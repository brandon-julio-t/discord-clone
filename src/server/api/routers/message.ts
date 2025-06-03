import { createMessageSchema } from "~/domains/message/schema";

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
});
