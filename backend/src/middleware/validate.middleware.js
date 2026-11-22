function isNonemptyString(value) {
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
        if (!isNonemptyString(req.body.title) || !isNonemptyString(req.body.eventType) || !isNonemptyString(req.body.location))
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

// validate data before update the a profile data

function isValideNumder(value) {
    if (value.length !== 10 || !(value.startsWith("06") || value.startsWith("07")))
        return false;
    for (let i = 0; i < value.length; i++)
    {
        if (value[i] < '0' || value[i] > '9')
                return false;
    }
    return true
}

function isValidAvatarUrl(value) {
    if (!isNonemptyString(value)) return false;
    try {
        const url = new URL(value);
        return url.protocol === "https:";
    } catch {
        return false;
    }
}

export function checkData(req, res, next) {
    try
    {
        if (req.body.name !== undefined) {
            if (!isNonemptyString(req.body.name))
                throw new Error("bad request");
        }
        if (req.body.number !== undefined) {
            if (!isNonemptyString(req.body.number) || !isValideNumder(req.body.number))
                throw new Error("bad request");
        }
        if (req.body.avatarUrl !== undefined) {
            if (!isNonemptyString(req.body.avatarUrl) || !isValidAvatarUrl(req.body.avatarUrl))
                    throw new Error("bad request");
        }
        next();
    }
    catch (error)
    {
        return res.status(400).json({
            message : error.message
        });
    }

}