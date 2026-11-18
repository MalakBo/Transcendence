import { updateProfileInDB } from "./organizer.service.js"

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