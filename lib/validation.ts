import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.string().url("Enter a valid URL").refine((value) => /^https?:\/\//i.test(value), "URL must start with http:// or https://")]).optional();
export const capsuleSchema = z.object({
  title: z.string().trim().min(1, "Give your capsule a title").max(160),
  message: z.string().trim().min(1, "Write something for your future self").max(100000),
  unlockAt: z.string().datetime({ offset: true }),
  projectName: z.string().trim().max(160).optional(),
  websiteUrl: optionalUrl,
  githubUrl: optionalUrl,
  additionalNotes: z.string().trim().max(10000).optional(),
});

export type CapsuleInput = z.infer<typeof capsuleSchema>;
