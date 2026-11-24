import { db } from "../../prisma/db.ts";
import { and } from "@prisma/orm-postgres/orm-client";

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
export async function updateProviderProfile(providerId, userId, data) {
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
    const updatedProvider = await db.orm.public.ProviderProfile.where({ id: providerId, userId: userId })
      .select("id", "businessName", "description", "location", "websiteUrl", "verified")
      .update(updateData);
    if(!updatedProvider) {
      return { status: "not_found" };
    }
    return { status: "success", provider: updatedProvider };
}
// offset : how many data to skip before starting to fetch the next data.
// limit : how many data to fetch in one request.
// all : fetch all data.
// slice : to get the data from the array (0 to limit).
export async function findProviders({ page = 1, limit = 10, location, search, category, minPrice, maxPrice }) {
  const offset = (page - 1) * limit;
  let query = db.orm.public.ProviderProfile;

  if(location) {
    query = query.where({ location });
  }
  if(search) {
    query = query.where((p) => p.businessName.ilike(`%${search}%`));
  }
  let categoryId;
  if(category) {
    const matchingCategory = await db.orm.public.ServiceCategory
      .where({ name: category })
      .select("id")
      .first();
    if(!matchingCategory) {
      return {
        providers: [],
        hasMore: false,
      };
    }
    categoryId = matchingCategory.id;
  }
  if(categoryId !== undefined || minPrice !== undefined || maxPrice !== undefined) {
    query = query.where((p) => p.services.some((service) => {
      const conditions = [service.isActive.eq(true),];
      if(categoryId !== undefined) {
        conditions.push(service.categoryId.eq(categoryId));
      }
      if(minPrice !== undefined) {
        conditions.push(service.price.gte(minPrice));
      }
      if(maxPrice !== undefined) {
        conditions.push(service.price.lte(maxPrice));
      }
      return and(...conditions);
    }));
  }

  const providers = await query
  .select(
    "id",
    "businessName",
    "description",
    "location",
    "websiteUrl",
    "verified"
  )
  .orderBy((p) => p.id.asc())
  .offset(offset)
  .limit(limit + 1)
  .all();

  return {
    providers: providers.slice(0, limit),
    hasMore: providers.length > limit,
  }
}