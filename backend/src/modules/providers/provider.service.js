import { db } from "../../prisma/db.ts";

export async function findProviderById(id) {
  const provider = await db.orm.public.ProviderProfile.where({ id })
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
    return { status: "user_not_found" };
  }
  if (user.role !== "PROVIDER") {
    return { status: "wrong_role" };
  }
  const existingProvider = await db.orm.public.ProviderProfile.where({ userId })
    .select("id")
    .first();
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
export async function updateProviderProfile(id, data) {
  const provider = await db.orm.public.ProviderProfile.where({ id: providerId })
    .select("id", "userId")
    .first();
    if(!provider) {
      return { status: "not_found" };
    }
    if(provider.userId !== userId) {
      return { status: "forbidden" };
    }
    const allowedFields = ["businessName", "description", "location", "websiteUrl"];
    const updateData = {};
    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(data, field)) {
        updateData[field] = data[field];
      }
    }
    if (Object.keys(updateData).length === 0) {
      return { status: "invalid_input" };
    }
    const updatedProvider = await db.orm.public.ProviderAvailability.where({ id: providerId, userId: userId })
      .select("id", "businessName", "description", "location", "websiteUrl", "verified")
      .update(updateData);
    if(!updatedProvider) {
      return { status: "not_found" };
    }
    return { status: "success", provider: updatedProvider };
}