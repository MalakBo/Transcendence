import { db } from "../../prisma/db.ts";
// async means our fct performs an asynchronous operation
// await : wait for our database query to finish
// .all() : retrieves the booking records

// export const getAllBookings = async () => {
//     return await db.orm.public.Booking.all();
// };

export const getAllBookings = async (userId, role) => 
{
    if (role === "ORGANIZER")
    {
        const events = await db.orm.public.Event
        .where({ organizerId: userId })
        .all();

        const bookings = [];
        for (const event of events)
        {
            const eventBookings = await db.orm.public.Booking
                .where({ eventId: event.id })
                .all();

            for (const booking of eventBookings)
            {
                const service = await db.orm.public.ProviderService
                    .where({ id: booking.providerServiceId })
                    .select("id", "name")
                    .first();
                
                bookings.push({
                    ...booking,
                    eventTitle: event.title,
                    serviceName: service?.name ?? "Unknown Service"
                });
            }
        }
        return bookings;
    }
    // if (role === "ORGANIZER") 
    // {
    //     const events = await db.orm.public.Event
    //         .where({ organizerId: userId })
    //         .all();

    //     const bookings = [];
    //     for (const event of events) 
    //     {
    //         const eventBookings = await db.orm.public.Booking
    //             .where({ eventId: event.id })
    //             .all();
    //         bookings.push(...eventBookings);
    //     }
    //     return bookings;
    // }
    if (role === "PROVIDER") 
    {
        const provider = await db.orm.public.ProviderProfile
            .where({ userId })
            .first();

        if (!provider) 
        {
            return [];
        }
        const services = await db.orm.public.ProviderService
            .where({ providerId: provider.id })
            .all();

        const bookings = [];

        for (const service of services)
        {
            const serviceBookings = await db.orm.public.Booking
            .where({ providerServiceId: service.id })
            .all();
            for (const booking of serviceBookings)
            {
                const event = await db.orm.public.Event
                .where({ id: booking.eventId })
                .select("id", "title")
                .first();
                bookings.push({
                    ...booking,
                    eventTitle: event?.title ?? "Unknown Event",
                    serviceName: service.name
                });
                // bookings.push({
                //     ...booking,
                //     eventTitle: event?.title ?? "Unknown Event"
                // });
            }
        }

        // for (const service of services) 
        // {
        //     const serviceBookings = await db.orm.public.Booking
        //         .where({ providerServiceId: service.id })
        //         .all();

        //     bookings.push(...serviceBookings);
        // }

        return bookings;
    }
    const error = new Error("You are not authorized to view bookings");
    error.statusCode = 403;
    throw error;
};
// .where({id :eventId}) => filters events by the requested ID
// first() => retrieves the first matching event if none exists the result is empty
// throw error stops the booking creation and passes the error to the controller
export const createBooking = async (
    eventId,
    providerServiceId,
    providerMessage,
    providerUserId
) => {
    // 1. Check whether the Event exists
    const event = await db.orm.public.Event
        .where({ id: eventId })
        .first();

    if (!event) 
    {
        const error = new Error("Event not found");
        error.statusCode = 404;
        throw error;
    }
    // 2. Check whether the Provider Service exists
    const service = await db.orm.public.ProviderService
        .where({ id: providerServiceId })
        .first();

    if (!service) 
    {
        const error = new Error("Provider service not found");
        error.statusCode = 404;
        throw error;
    }
    if (!service.isActive) 
    {
        const error = new Error("Provider service is not active");
        error.statusCode = 400;
        throw error;
    }
    // 4. Find the Provider Profile that owns the service
    const provider = await db.orm.public.ProviderProfile
        .where({ id: service.providerId })
        .first();

    // 5. Check ownership
    if (!provider || provider.userId !== providerUserId) 
    {
        const error = new Error("You are not authorized to book with this service");
        error.statusCode = 403;
        throw error;
    }
    // 6. Prevent duplicate active booking requests
    const existingBookings = await db.orm.public.Booking
        .where({
            eventId,
            providerServiceId
        })
        .all();

    const duplicate = existingBookings.some(
        booking =>
            booking.status === "PENDING" ||
            booking.status === "ACCEPTED"
    );

    if (duplicate) 
    {
        const error = new Error("An active booking request already exists for this event and service");
        error.statusCode = 409;
        throw error;
    }
    // 7. Create the Booking
    const booking = await db.orm.public.Booking.create({
        eventId,
        providerServiceId,
        providerMessage: providerMessage ?? null,
        status: "PENDING"
    });
    return booking;
};

export const updateBookingStatus = async (
    bookingId,
    status,
    organizerMessage,
    organizerUserId
) => {
    // 1. Find the Booking
    const booking = await db.orm.public.Booking
        .where({ id: bookingId })
        .first();

    if (!booking) {
        const error = new Error("Booking not found");
        error.statusCode = 404;
        throw error;
    }

    // 2. Find the Event associated with this Booking
    const event = await db.orm.public.Event
        .where({ id: booking.eventId })
        .first();

    if (!event) {
        const error = new Error("Event not found");
        error.statusCode = 404;
        throw error;
    }

    // 3. Verify that the Organizer owns the Event
    if (event.organizerId !== organizerUserId) {
        const error = new Error(
            "You are not authorized to update this booking"
        );
        error.statusCode = 403;
        throw error;
    }

    // 4. Only pending Bookings can be accepted or rejected
    if (booking.status !== "PENDING") {
        const error = new Error(
            "Only pending bookings can be accepted or rejected"
        );
        error.statusCode = 409;
        throw error;
    }

    // 5. Update the Booking
    const updatedBooking = await db.orm.public.Booking
        .where({
            id: bookingId,
            status: "PENDING"
        })
        .update({
            status,
            organizerMessage: organizerMessage ?? null
        });

    if (!updatedBooking) {
        const error = new Error(
            "Booking status changed before your request was processed"
        );
        error.statusCode = 409;
        throw error;
    }

    return updatedBooking;
};

export const getAvailableServices = async (userId) => {
    // 1. Find the authenticated provider's profile
    const provider = await db.orm.public.ProviderProfile
        .where({ userId })
        .first();

    // 2. Check whether the provider profile exists
    if (!provider) {
        const error = new Error("Provider profile not found");
        error.statusCode = 404;
        throw error;
    }

    // 3. Retrieve only active services owned by the provider
    const services = await db.orm.public.ProviderService
        .where({
            providerId: provider.id,
            isActive: true
        })
        .select("id", "name", "description", "price", "isActive")
        .all();

    // 4. Return available services
    return services;
};