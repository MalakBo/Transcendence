import { db } from "../../prisma/db.ts";

export const getAllBookings = async () => {
  return await db.orm.public.Booking.all();
};

export const createBooking = async (eventId, providerServiceId, organizerMessage) => {
  return await db.orm.public.Booking.create({
    eventId,
    providerServiceId,
    organizerMessage: organizerMessage ?? null,
    status: "PENDING"
  });
};
