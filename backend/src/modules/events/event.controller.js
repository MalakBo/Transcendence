import { createEventService, getEventService, getEventByIdService, updatedEventService, deletedEeventSErvice } from "./event.service.js"

export const createEvent = async (req, res) => {
    try
    {
        const createdEvent = await createEventService(req.body, req.user.id);
        res.status(201).json(createdEvent);
    }
    catch (error)
    {
        res.status(400).json({
            message : error.message
        });
    }
}
export const getEvent = async (req, res) => {
    try
    {
        const getedEvent = await getEventService();
        res.status(200).json(getedEvent);
    }
    catch (error)
    {
        res.status(404).json({
            message : error.message
        });
    }
}

export const getEventById = async (req, res) => {
    try
    {
        const getedEventById = await getEventByIdService(req.user.id, req.params.id);
        if (!getedEventById) throw new Error("Not found");
        res.status(200).json(getedEventById);
    }
    catch (error)
    {
        res.status(404).json({
            message : error.message
        });
    }
}

export const updateEvent = async (req, res) => {
    try
    {
        const updatedEvent = await updatedEventService(req.user.id, req.params.id, req.body);
        res.status(200).json(updatedEvent);
    }
    catch(error)
    {
        res.status(404).json({
            message : error.message
        });
    }
}

export const deleteEvent = async (req, res) => {
    try
    {
        const deletedEvent = await deletedEeventSErvice(req.user.id, req.params.id);
        res.status(204).json(deletedEvent);
    }
    catch(error)
    {
        res.status(404).json({
            message : error.message
        });
    }
}