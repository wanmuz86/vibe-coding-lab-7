import { z } from "zod";
import { COMMENT_VISIBILITIES } from "@/modules/comments/rules";

export const createCommentSchema = z.object({
  body: z.string().trim().min(1, "Comment is required.").max(2000, "Comment must be 2000 characters or fewer."),
  visibility: z.enum(COMMENT_VISIBILITIES, "Choose who can see this comment."),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
