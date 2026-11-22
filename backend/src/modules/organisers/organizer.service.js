import { db } from "../../prisma/db.ts";

export const updateProfileInDB = async (organiserId, data) => {
    const user = db.orm.public.User;
    const allowedFeilds = [
        "name",
        "phone",
        "avatarUrl"
    ];
    for (const feild of Object.keys(data)){
        if (!allowedFeilds.includes(feild))
            throw new Error("Modification of" + feild + "is forbidden");
    }
    const updatedProfile = await user.where({id : organiserId}).update(data);
    return updatedProfile;
}

export const getMyEventsInDB = async (userId) => {
    const user = db.orm.public.Event;
    const myEvents = await user.where({organizerId : userId}).all();
    return myEvents;
}

export const getUpcomingEventsInDB = async (userId) => {
    const user = db.orm.public.Event;
    const allEvents = await user.where({organizerId : userId}).all();
    const now = new Date();
    const upcomingEvents = allEvents.filter((event) => new Date(event.eventDate) >= now
    );
    return upcomingEvents;
}

export const getPastEventsInDB = async (userId) => {
    const user = db.orm.public.Event;
    const allEvents = await user.where({organizerId : userId}).all();
    const now = new Date();
    const pastEvents = allEvents.filter((event) => new Date(event.eventDate) < now
    );
    return pastEvents;
}