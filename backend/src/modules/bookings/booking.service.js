import { db } from "../../prisma/db.ts";
// async means our fct performs an asynchronous operation
// await : wait for our database query to finish
// .all() : retrieves the booking records

export const getAllBookings = async () => {
    return await db.orm.public.Booking.all();
};
// .where({id :eventId}) => filters events by the requested ID
// first() => retrieves the first matching event if none exists the result is empty
// throw error stops the booking creation and passes the error to the controller
export const createBooking = async(eventId, providerServiceId, organizerMessage, organizerId) =>{
    const event = await db.orm.public.Event
    .where({ id: eventId})
    .first();
    if(!event)
    {
        const error = new Error("Event not found");
        error.statusCode = 404;
        throw error;
    }
    if(event.organizerId !== organizerId)
    {
        const error = new Error(
            "You are not authorized to book services for this event"
        );
        error.statusCode = 403;
        throw error;
    }
    const providerService = await db.orm.public.ProviderService
        .where({id: providerServiceId})
        .first();
    if(!providerService)
    {
        const error = new Error("Provider service not found");
        error.statusCode = 404;
        throw error;
    }
    if(!providerService.isActive)
    {
        const error = new Error("Provider service is not active");
        error.statusCode = 400;
        throw error;
    }
    const booking = await db.orm.public.Booking.create({
        eventId: eventId,
        providerServiceId: providerServiceId,
        organizerMessage: organizerMessage ?? null,
        status: "PENDING"
    });
    return booking;
};
