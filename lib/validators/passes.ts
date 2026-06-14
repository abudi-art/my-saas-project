import { z } from "zod";

export const createPassSchema = z.object({
  programId: z.string().uuid(),
  customerIdentifier: z.string().min(1).max(255),
});

export type CreatePassInput = z.infer<typeof createPassSchema>;
