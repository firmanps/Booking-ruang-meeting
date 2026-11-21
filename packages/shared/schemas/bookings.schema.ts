import { z } from "zod";

export const createBookingSchema = z.object({
  roomId: z.uuid(),
  startAt: z.iso.datetime({ offset: true }),
  endAt: z.iso.datetime({ offset: true }),
  title: z.string().trim().min(1).max(50),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
