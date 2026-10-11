import { db } from '../../prisma/db.ts';

export async function findProviderById(id) {
    const provider = await db.orm.public.ProviderProfile.where({id})
    .select(
        "id",
        "businessName",
        "description",
        "location",
        "websiteUrl",
        "verified",
    )
    .first();
    return provider;
}
export async function createProviderProfile(userId, data) {
    const user = await db.orm.public.User.where({ id: userId })
    .select("id", "role")
    .first();
    if (!user) {
        return { status: "user_not_found"};
    }
    if (user.role !== "PROVIDER") {
        return { status: "wrong_role" };
    }
    const existingProvider = await db.orm.public.ProviderProfile.where({ userId })
    .select("id").first();
    if (existingProvider) {
        return { status: "already_exists" };
    }
    const newProvider = await db.orm.public.ProviderProfile.create({
        data: {
            userId: userId,
            businessName: data.businessName,
            description: data.description,
            location: data.location,
            websiteUrl: data.websiteUrl,
        },
    });
    return { status: "success", provider: newProvider };
}