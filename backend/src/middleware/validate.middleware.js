function isNomemptyString(value) {
    return (typeof value === "string" && value.trim().length > 0);
}
export default function checkEvent(req, res, next) {
    try
    {
        const { eventDate } = req.body;
        const date = new Date(eventDate).getTime();
        if (typeof eventDate !== "string" || !eventDate.trim() ||
            Number.isNaN(date) || date < Date.now() + 24 * 3600 * 1000)
            throw new Error("bad request");
        if (!isNomemptyString(req.body.title) || !isNomemptyString(req.body.eventType) || !isNomemptyString(req.body.location))
            throw new Error("bad request");
        if (req.body.budget < 0 || req.body.guestCount <= 0)
            throw new Error("bad request");
        next();
    }
    catch(error)
    {
        return res.status(400).json({
            message : error.message
        });
    }
}