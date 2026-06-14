import { z } from "zod";

export const scanStampSchema = z.object({
  passId: z.string().uuid(),
});

export type ScanStampInput = z.infer<typeof scanStampSchema>;
