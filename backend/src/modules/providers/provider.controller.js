import {
  findProviderById,
  createProviderProfile,
  updateProviderProfile,
  findProviders,
} from "./provider.service.js";

export async function getProviderById(req, res) {
  try {
    const { id } = req.params;
    const provider = await findProviderById(id);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (error) {
    console.error("Error fetching provider: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
export async function createProvider(req, res) {
  try {
    const { businessName, description, location, websiteUrl } = req.body ?? {};
    if (
      typeof businessName !== "string" ||
      !businessName.trim() ||
      typeof location !== "string" ||
      !location.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid input: 'businessName' and 'location' are required and must be non-empty strings.",
      });
    }
    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid input: description must be a string.",
      });
    }
    if (websiteUrl !== undefined && websiteUrl !== null) {
      if (typeof websiteUrl !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid input: websiteUrl must be a string.",
        });
      }
      try {
        const url = new URL(websiteUrl);
        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid input: websiteUrl must be a valid URL.",
        });
      }
    }
    if (req.user == null || req.user.id == null) {
      return res.status(401).json({
        success: false,
        message: "Authentication required: User information is missing.",
      });
    }
    const result = await createProviderProfile(req.user.id, {
      businessName: businessName.trim(),
      location: location.trim(),
      description: description ? description.trim() : null,
      websiteUrl: websiteUrl || null,
    });
    if (result.status === "user_not_found") {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    if (result.status === "already_exists") {
      return res.status(409).json({
        success: false,
        message: "Provider profile already exists for this user.",
      });
    }
    if (result.status === "wrong_role") {
      return res.status(403).json({
        success: false,
        message:
          "Only users with the PROVIDER role can create a provider profile.",
      });
    }
    return res.status(201).json({
      success: true,
      data: result.provider,
    });
  } catch (error) {
    console.error("Error creating provider profile: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
export async function updateProvider(req, res) {
  try {
    const { id } = req.params;
    if (req.user == null || req.user.id == null) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }
    // 2. Check that the request body is an object
    const body = req.body;
    if (body == null || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
      });
    }
    const allowedFields = [
      "businessName",
      "description",
      "location",
      "websiteUrl",
    ];
    const fields = Object.keys(body);
    if (
      fields.length === 0 ||
      fields.some((fields) => !allowedFields.includes(fields))
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No valid fields to update. Allowed fields are: " +
          allowedFields.join(", "),
      });
    }
    // 4. Validate required string fields when supplied
    for (const field of ["businessName", "location"]) {
      if (
        body[field] !== undefined &&
        (typeof body[field] !== "string" || !body[field].trim())
      ) {
        return res.status(400).json({
          success: false,
          message: `'${field}' must be a non-empty string.`,
        });
      }
    }
    // 5. Validate description when supplied
    if (
      body.description !== undefined &&
      body.description !== null &&
      typeof body.description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "description must be a string.",
      });
    }
    // 6. Validate website URL when supplied
    if (body.websiteUrl !== undefined && body.websiteUrl !== null) {
      if (typeof body.websiteUrl !== "string") {
        return res.status(400).json({
          success: false,
          message: "websiteUrl must be a valid URL",
        });
      }

      try {
        const url = new URL(body.websiteUrl);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        return res.status(400).json({
          success: false,
          message: "websiteUrl must be a valid HTTP or HTTPS URL",
        });
      }
    }

    // 7. Prepare only the supplied editable fields
    const updates = {};

    if (body.businessName !== undefined) {
      updates.businessName = body.businessName.trim();
    }

    if (body.location !== undefined) {
      updates.location = body.location.trim();
    }

    if (body.description !== undefined) {
      updates.description = body.description?.trim() || null;
    }

    if (body.websiteUrl !== undefined) {
      updates.websiteUrl = body.websiteUrl;
    }

    // 8. Ask the service to update the profile
    const result = await updateProviderProfile(id, req.user.id, updates);

    if (result.status === "not_found") {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    if (result.status === "forbidden") {
      return res.status(403).json({
        success: false,
        message: "You can only update your own provider profile",
      });
    }
    if (result.status === "invalid_input") {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.provider,
    });
  } catch (error) {
    console.error("Error updating provider:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getProviders(req, res) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const location = req.query.location;
    const search = req.query.search;
    const category = req.query.category;
    const minPrice = req.query.minPrice === undefined ? undefined : Number(req.query.minPrice);
    const maxPrice = req.query.maxPrice === undefined ? undefined : Number(req.query.maxPrice);

    if(!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 50) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination.",
      });
    }

    if (
      (minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) ||
      (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0)) || (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid price range.",
      });
    }

    const filters = {
      location,
      search,
      category,
      minPrice,
      maxPrice,
    };


    const result = await findProviders({ page, limit, ...filters });
    return res.status(200).json({
      success: true,
      data: result.providers,
      pagination: {
        page,
        limit,
        hasMore: result.hasMore,
      },
    });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}