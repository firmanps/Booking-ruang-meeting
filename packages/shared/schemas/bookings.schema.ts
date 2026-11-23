import { z } from "zod";

export const createBookingSchema = z.object({
  roomId: z.uuid(),
  startAt: z.iso.datetime({ offset: true }),
  endAt: z.iso.datetime({ offset: true }),
  title: z.string().trim().min(1).max(50),
});

export const bookingStatusSchema = z.enum(["CONFIRMED", "CANCELLED"]);
export const bookingSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  startAt: z.iso.datetime(),
  endAt: z.iso.datetime(),
  status: bookingStatusSchema,
  cancelledAt: z.iso.datetime().nullable(),
  cancelledBy: z.uuid().nullable(),
  createdAt: z.iso.datetime(),
  user: z.object({ id: z.uuid(), name: z.string(), email: z.email(), role: z.enum(["EMPLOYEE", "ADMIN"]) }),
  rooms: z.object({ id: z.uuid(), name: z.string(), capacity: z.number().int(), locations: z.string() }),
});

export const bookingsResponseSchema = z.object({ bookings: z.array(bookingSchema) });
export const bookingsDashboardResponseSchema = z.object({
  bookings: z.array(bookingSchema),
  summary: z.object({
    totalUpcomingBookings: z.number().int().nonnegative(),
    totalRooms: z.number().int().nonnegative(),
    totalActiveRooms: z.number().int().nonnegative(),
  }),
});
export const myBookingSchema = bookingSchema.omit({ user: true });
export const myBookingsResponseSchema = z.object({ bookings: z.array(myBookingSchema) });
export const cancelBookingResponseSchema = z.object({
  message: z.string(),
  booking: z.object({
    id: z.uuid(), title: z.string(), status: bookingStatusSchema,
    cancelledAt: z.iso.datetime().nullable(), cancelledBy: z.uuid().nullable(),
  }),
});
export const roomAvailabilityBookingSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  startAt: z.iso.datetime(),
  endAt: z.iso.datetime(),
});
export const roomAvailabilityResponseSchema = z.object({
  room: z.object({ id: z.uuid(), name: z.string(), capacity: z.number().int(), facilities: z.string(), locations: z.string(), isActive: z.boolean() }),
  date: z.string(),
  timezone: z.string(),
  bookings: z.array(roomAvailabilityBookingSchema),
});
export const createBookingResponseSchema = z.object({
  id: z.uuid(), roomId: z.uuid(), userId: z.uuid(), title: z.string(),
  startAt: z.iso.datetime(), endAt: z.iso.datetime(), status: bookingStatusSchema, createdAt: z.iso.datetime(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type Booking = z.infer<typeof bookingSchema>;
export type BookingsDashboardSummary = z.infer<typeof bookingsDashboardResponseSchema>["summary"];
export type MyBooking = z.infer<typeof myBookingSchema>;
export type RoomAvailabilityBooking = z.infer<typeof roomAvailabilityBookingSchema>;
