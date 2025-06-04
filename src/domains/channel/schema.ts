import { z } from "zod";

export const createChannelSchema = z.object({
  name: z.string().min(1).trim(),
});

export const updateChannelSchema = createChannelSchema.extend({
  id: z.string(),
});
