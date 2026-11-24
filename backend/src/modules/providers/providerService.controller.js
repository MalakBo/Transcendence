
import { createProviderService, getProviderServices, updateProviderService, deleteProviderService } from "./providerService.service.js";

// CREATE PROVIDER SERVICE
// POST /api/providers/:providerId/services

export async function createService(req, res) {
  try {
    // 1. Get provider ID from URL
    const { providerId } = req.params;

    // 2. Check authentication
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // 3. Read request body
    const {
      categoryId,
      name,
      description,
      price,
      pricingType,
    } = req.body ?? {};

    // 4. Validate category ID
    if (
      typeof categoryId !== "string" ||
      !categoryId.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "categoryId is required",
      });
    }

    // 5. Validate service name
    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "name must be a non-empty string",
      });
    }

    // 6. Validate description
    if (
      description != null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "description must be a string",
      });
    }

    // 7. Validate pricing type
    const allowedPricingTypes = [
      "FIXED",
      "PER_HOUR",
      "PER_GUEST",
      "CUSTOM",
    ];

    if (!allowedPricingTypes.includes(pricingType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pricingType",
      });
    }

    // 8. Validate required price
    if (
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Price is required and must be a non-negative number",
      });
    }

    // 9. Call the service layer
    const result = await createProviderService(
      providerId,
      req.user.id,
      {
        categoryId: categoryId.trim(),
        name: name.trim(),
        description: description?.trim() ?? null,
        price,
        pricingType,
      },
    );

    // 10. Provider not found
    if (result.status === "provider_not_found") {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    // 11. Forbidden
    if (result.status === "forbidden") {
      return res.status(403).json({
        success: false,
        message: "You cannot add services to another provider's profile",
      });
    }

    // 12. Invalid category ID
    if (result.status === "invalid_category") {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    // 13. Category not found
    if (result.status === "category_not_found") {
      return res.status(400).json({
        success: false,
        message: "Category does not exist",
      });
    }

    // 14. Invalid service name
    if (result.status === "invalid_name") {
      return res.status(400).json({
        success: false,
        message: "Invalid service name",
      });
    }

    // 15. Invalid description
    if (result.status === "invalid_description") {
      return res.status(400).json({
        success: false,
        message: "Description must be a string",
      });
    }

    // 16. Invalid price
    if (result.status === "invalid_price") {
      return res.status(400).json({
        success: false,
        message: "Price is required and must be a non-negative number",
      });
    }

    // 17. Invalid pricing type
    if (result.status === "invalid_pricing_type") {
      return res.status(400).json({
        success: false,
        message: "Invalid pricing type",
      });
    }

    // 18. Unexpected result
    if (result.status !== "success") {
      console.error(
        "Unexpected createProviderService result:",
        result.status,
      );

      return res.status(500).json({
        success: false,
        message: "Unable to create provider service",
      });
    }

    // 19. Success
    return res.status(201).json({
      success: true,
      message: "Provider service created successfully",
      data: result.service,
    });

  } catch (error) {
    console.error("Error creating provider service:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getServices(req, res) {
  try {
    const { providerId } = req.params;
    const result = await getProviderServices;
    if(result.status === "provider_not_found")
      return res.status(404).json({
          success: false,
          message: "Provider not found",
    });
    if(result.status !== "success") {
      return res.status(500).json({
        success: false,
        message: "Unable to retrieve provider services",
      });
    }
    return res.status(200).json({
      success: true,
      data: result.services,
    });
  } catch (error) {
    console.error("Error getting provider services:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
// PATCH /api/providers/:providerId/services/:serviceId
export async function updateService(req, res) {
  try {
    const { providerId, serviceId } = req.params;
    
    if(!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    const updates = req.body;
    if(!updates || typeof updates !== "object" || Array.isArray(updates)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
      });
    }
    const result = await updateProviderService(providerId, serviceId, req.user.id, updates);
    if(result.status === "provider_not_found") {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }
    if(result.status === "service_not_found") {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }
    if(result.status === "forbidden") {
      return res.status(403).json({
        success: false,
        message: "You cannot update another provider's service",
      });
    }
    const validationErrors = {
      invalid_input: "No valid fields provided for update",
      invalid_category: "Invalid category",
      category_not_found: "Category not found",
      invalid_name: "Invalid service name",
      invalid_description: "Invalid description",
      invalid_price: "Price must be a non-negative number",
      invalid_pricing_type: "Invalid pricing type",
    };
    if(Object.prototype.hasOwnProperty.call(validationErrors, result.status)) {
      return res.status(400).json({
        success: false,
        message: validationErrors[result.status],
      });
    }
    if(result.status !== "success") {
      return res.status(500).json({
        success: false,
        message: "Unable to update provider service",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Provider service updated successfully",
      data: result.service,
    });
  } catch (error) {
    console.error("Error updating provider service:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
// DELETE /api/providers/:providerId/services/:serviceId
export async function deleteService(req, res) {
  try {
    const { providerId, serviceId } = req.params;
    if(!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    const result = await deleteProviderService(providerId, serviceId, req.user.id);
    if(result.status === "provider_not_found") {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }
    if(result.status === "service_not_found") {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }
    if(result.status === "forbidden") {
      return res.status(403).json({
        success: false,
        message: "You cannot delete another provider's service",
      });
    }
    if(result.status !== "success") {
      return res.status(500).json({
        success: false,
        message: "Unable to delete provider service",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Provider service deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting provider service:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}