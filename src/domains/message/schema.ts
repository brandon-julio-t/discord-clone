import { z } from "zod";

export const createMessageSchema = z.object({
  textContent: z.string().min(1),
  channelId: z.string(),
});
