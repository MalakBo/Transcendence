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