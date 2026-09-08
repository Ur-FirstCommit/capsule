import { z } from "zod";

export const capsuleSchema = z.object({
  title: z.string().trim().min(1, "Give your capsule a title").max(160),
  message: z.string().trim().min(1, "Write something for your future self").max(100000),
  unlockAt: z.string().datetime({ offset: true }),
  additionalNotes: z.string().trim().max(10000).optional(),
});

export type CapsuleInput = z.infer<typeof capsuleSchema>;
