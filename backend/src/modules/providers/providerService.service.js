
import { db } from "../../prisma/db.ts";

// Pricing types defined in contract.prisma
const allowedPricingTypes = [
  "FIXED",
  "PER_HOUR",
  "PER_GUEST",
  "CUSTOM",
];

// Fields that a provider is allowed to update
const editableFields = [
  "categoryId",
  "name",
  "description",
  "price",
  "pricingType",
];

// Validate service information.
// This also supports partial data for PATCH requests.
function validateServiceData(data) {
  if (data.name !== undefined) {
    if (typeof data.name !== "string" || !data.name.trim()) {
      return "invalid_name";
    }
  }

  if (
    data.description != null &&
    typeof data.description !== "string"
  ) {
    return "invalid_description";
  }

  if (data.pricingType !== undefined) {
    if (!allowedPricingTypes.includes(data.pricingType)) {
      return "invalid_pricing_type";
    }
  }

  if (data.price !== undefined) {
    if (
      typeof data.price !== "number" ||
      !Number.isFinite(data.price) ||
      data.price < 0
    ) {
      return "invalid_price";
    }
  }

  return null;
}

// Find a provider by ID
async function findProvider(providerId) {
  return db.orm.public.ProviderProfile
    .where({ id: providerId })
    .select("id", "userId")
    .first();
}

// Find a service category by ID
async function findCategory(categoryId) {
  return db.orm.public.ServiceCategory
    .where({ id: categoryId })
    .select("id")
    .first();
}

// POST /api/providers/:providerId/services

export async function createProviderService(providerId, userId, data) {
  // 1. Check provider exists
  const provider = await findProvider(providerId);

  if (!provider) {
    return { status: "provider_not_found" };
  }

  // 2. Check ownership
  if (provider.userId !== userId) {
    return { status: "forbidden" };
  }

  // 3. Validate category ID
  if (
    typeof data.categoryId !== "string" ||
    !data.categoryId.trim()
  ) {
    return { status: "invalid_category" };
  }

  // 4. Validate other fields
  const validationError = validateServiceData(data);

  if (validationError) {
    return { status: validationError };
  }

  // 5. Require a service name
  if (typeof data.name !== "string" || !data.name.trim()) {
    return { status: "invalid_name" };
  }

  // 6. Require a valid pricing type
  if (!allowedPricingTypes.includes(data.pricingType)) {
    return { status: "invalid_pricing_type" };
  }

  // 7. Require a price for every pricing type
  if (data.price == null) {
    return { status: "invalid_price" };
  }

  // 8. Check category exists
  const category = await findCategory(data.categoryId.trim());

  if (!category) {
    return { status: "category_not_found" };
  }

  // 9. Create the service in PostgreSQL
  const newService = await db.orm.public.ProviderService.create({
    providerId,
    categoryId: data.categoryId.trim(),
    name: data.name.trim(),
    description: data.description?.trim() ?? null,
    price: data.price,
    pricingType: data.pricingType,
  });

  return {
    status: "success",
    service: newService,
  };
}

// GET /api/providers/:providerId/services

export async function getProviderServices(providerId) {
  // 1. Check provider exists
  const provider = await findProvider(providerId);

  if (!provider) {
    return { status: "provider_not_found" };
  }

  // 2. Get all services for this provider
  const services = await db.orm.public.ProviderService
    .where({ providerId })
    .select(
      "id",
      "providerId",
      "categoryId",
      "name",
      "description",
      "price",
      "pricingType",
      "isActive",
    )
    .all();

  return {
    status: "success",
    services,
  };
}
// PATCH /api/providers/:providerId/services/:serviceId

export async function updateProviderService(
  providerId,
  serviceId,
  userId,
  updates,
) {
  // 1. Check provider exists
  const provider = await findProvider(providerId);

  if (!provider) {
    return { status: "provider_not_found" };
  }

  // 2. Check ownership
  if (provider.userId !== userId) {
    return { status: "forbidden" };
  }

  // 3. Find the service belonging to this provider
  const service = await db.orm.public.ProviderService
    .where({ id: serviceId, providerId })
    .select(
      "id",
      "categoryId",
      "name",
      "description",
      "price",
      "pricingType",
    )
    .first();

  if (!service) {
    return { status: "service_not_found" };
  }

  // 4. Only allow specific fields to be updated
  const safeUpdates = {};

  for (const field of editableFields) {
    if (Object.prototype.hasOwnProperty.call(updates, field)) {
      safeUpdates[field] = updates[field];
    }
  }

  if (Object.keys(safeUpdates).length === 0) {
    return { status: "invalid_input" };
  }

  // 5. Validate updated values
  const validationError = validateServiceData(safeUpdates);

  if (validationError) {
    return { status: validationError };
  }

  // 6. Check category if it is being changed
  if (safeUpdates.categoryId !== undefined) {
    if (
      typeof safeUpdates.categoryId !== "string" ||
      !safeUpdates.categoryId.trim()
    ) {
      return { status: "invalid_category" };
    }

    safeUpdates.categoryId = safeUpdates.categoryId.trim();

    const category = await findCategory(safeUpdates.categoryId);

    if (!category) {
      return { status: "category_not_found" };
    }
  }

  // 7. Price must always exist
  const finalPrice =
    safeUpdates.price !== undefined
      ? safeUpdates.price
      : service.price;

  if (finalPrice == null) {
    return { status: "invalid_price" };
  }

  // 8. Clean text values
  if (safeUpdates.name !== undefined) {
    safeUpdates.name = safeUpdates.name.trim();
  }

  if (typeof safeUpdates.description === "string") {
    safeUpdates.description = safeUpdates.description.trim();
  }

  // 9. Update the database record
  const updatedService = await db.orm.public.ProviderService
    .where({ id: serviceId, providerId })
    .update(safeUpdates);

  if (!updatedService) {
    return { status: "service_not_found" };
  }

  return {
    status: "success",
    service: updatedService,
  };
}

// DELETE /api/providers/:providerId/services/:serviceId
export async function deleteProviderService(
  providerId,
  serviceId,
  userId,
) {
  // 1. Check provider exists
  const provider = await findProvider(providerId);

  if (!provider) {
    return { status: "provider_not_found" };
  }

  // 2. Check ownership
  if (provider.userId !== userId) {
    return { status: "forbidden" };
  }

  // 3. Check service exists under this provider
  const service = await db.orm.public.ProviderService
    .where({ id: serviceId, providerId })
    .select("id")
    .first();

  if (!service) {
    return { status: "service_not_found" };
  }

  // 4. Delete the service
  await db.orm.public.ProviderService
    .where({ id: serviceId, providerId })
    .delete();

  return { status: "success" };
}
