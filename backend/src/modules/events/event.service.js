import { use } from "react";
import { db } from "../../prisma/db.ts";

export const createEventService = async (data, Id) => {
    const event = db.orm.public.Event;
    const createdEvent = await event.create(
        {
            organizerId : Id,
            title : data.title,
            eventType : data.eventType,
            description : data.description,
            eventDate : Temporal.Instant.from(data.eventDate),
            location : data.location,
            guestCount : data.guestCount,
            budget : data.budget
        }
    )
    return createdEvent;
}

export const getEventService = async () => {
    const event = db.orm.public.Event;
    const getedEvent = await event.all();
    return getedEvent;
}

export const getEventByIdService = async (userId, eventId) => {
    const event = db.orm.public.Event;
    const getedEventById = await event.where({
        id : eventId,
        organizerId : userId
    }).first();
    return getedEventById;
}

export const updatedEventService = async (userId, eventId, data) => {
    const forbidenfield = [
        "organizerId",
        "id"
    ];
    for (const feild of forbidenfield){
        if (Object.hasOwn(data, feild))
            throw Error("bad request");
    }
    const event = db.orm.public.Event;
    const updatedEvent = await event.where({id: eventId, organizerId: userId}).update(data);
    return updatedEvent;
}

export const deletedEeventSErvice = async (userId, eventId) => {
    const event = db.orm.public.Event;
    const deletedEvent = await event.where({organizerId: userId, id : eventId}).delete();
    return (deletedEvent);
}