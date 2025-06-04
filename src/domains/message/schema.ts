import { z } from "zod";

export const createMessageSchema = z.object({
  id: z.string(),
  textContent: z.string().min(1).trim(),
  channelId: z.string(),
});

export const updateMessageSchema = createMessageSchema.extend({
  id: z.string(),
});
