import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().trim().min(1).max(100),
  capacity: z.number().int().positive().max(1000),
  facilities: z.string().trim().min(1).max(1000),
  locations: z.string().trim().min(1).max(1000),
  is_active: z.boolean().optional().default(true),
});

export const updateRoomSchema = createRoomSchema.partial().refine((data) => Object.keys(data).length > 0, { message: "Minimal satu field harus diisi" });

export const roomsQuerySchema = z.object({
  minCapacity: z.coerce.number().int().positive().optional(),
  is_active: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) =>
      value === undefined ? undefined : value === 'true',
    ),
});

export const roomAvailabilityQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type RoomsQueryInput = z.infer<typeof roomsQuerySchema>;
export type RoomAvailabilityQueryInput = z.infer<typeof roomAvailabilityQuerySchema>;
