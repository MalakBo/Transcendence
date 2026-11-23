import { updateProfileInDB, getMyEventsInDB, getUpcomingEventsInDB, getPastEventsInDB } from "./organizer.service.js"

export const getOrganiserProfile = (req, res) => {
    try
    {
        const profile = {
            name : req.user.name,
            email : req.user.email,
            phone : req.user.phone,
            avatarUrl : req.user.avatarUrl
        };
        res.status(200).json(profile);
    }
    catch (error)
    { 
        res.status(500).json("Internal server error");
    }
}

export const updateOrganiserProfile = async (req, res) => {
    try
    {
        const updatedProfile = await updateProfileInDB(req.user.id, req.body);
        const safeUpdatefProfile = {
            name : updatedProfile.name,
            email : updatedProfile.email,
            phone : updatedProfile.phone,
            avatarUrl : updatedProfile.avatarUrl
        };
        res.status(200).json(safeUpdatefProfile);
    }
    catch (error)
    {
        res.status(400).json("bad Request");
    }
}

export const getMyEvents = async (req, res) => {
    try
    {
        const myEvents = await getMyEventsInDB(req.user.id);
        res.status(200).json(myEvents);
    }
    catch(error)
    {
        res.status(404).json("bad Request");
    }
}

export const getUpcomingEvents = async (req, res) => {
    try
    {
        const upcomingevents = await getUpcomingEventsInDB(req.user.id);
        if (!upcomingevents)
            return res.status(404).json("bad Request!!");
        res.status(200).json(upcomingevents);
    }
    catch(error)
    {
        res.status(404).json("bad Request");
    }
}

export const getPastEvents = async (req, res) => {
    try
    {
        const pastevents = await getPastEventsInDB(req.user.id);
        if (!pastevents)
            return res.status(404).json("bad Request!!");
        res.status(200).json(pastevents);
    }
    catch(error)
    {
        res.status(404).json("bad Request");
    }
}