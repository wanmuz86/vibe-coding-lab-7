import { z } from "zod";
import { TICKET_PRIORITIES } from "@/modules/tickets/rules";

export const createTicketSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(120, "Title must be 120 characters or fewer."),
  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(5000, "Description must be 5000 characters or fewer."),
  priority: z.enum(TICKET_PRIORITIES, "Choose a priority."),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
