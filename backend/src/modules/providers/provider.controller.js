import { findProviderById, createProviderProfile} from './provider.service.js';

export async function getProviderById(req, res) {
    try {
        const { id } = req.params;
        const provider = await findProviderById(id);
        if(!provider) {
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
        if(typeof businessName !== 'string' || !businessName.trim() || typeof location !== 'string' || !location.trim())
        {
            return res.status(400).json({
                success: false,
                message: "Invalid input: 'businessName' and 'location' are required and must be non-empty strings.",
            });
        }
        if(description !== undefined && description !== null && typeof description !== "string")
        {
            return res.status(400).json({
                success: false,
                message: "Invalid input: description must be a string."
            });
        }
        if(websiteUrl !== undefined && websiteUrl !== null)
        {
            if(typeof websiteUrl !== "string")
            {
                return res.status(400).json({
                    success: false,
                    message: "Invalid input: websiteUrl must be a string."
                });
            }
            try {
                const url = new URL(websiteUrl);
                if(!["http:", "https:"].includes(url.protocol)){
                    throw new Error("Invalid protocol");
                }
            } catch {
                return res.status(400).json({
                    success: false,
                    message: "Invalid input: websiteUrl must be a valid URL."
                });
            }
        }
        if(req.user == null || req.user.id == null)
        {
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
        if(result.status === "user_not_found")
        {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }
        if(result.status === "already_exists")
        {
            return res.status(409).json({
                success: false,
                message: "Provider profile already exists for this user.",
            });
        }
        if (result.status === "wrong_role") 
        {
            return res.status(403).json({
            success: false,
            message: "Only users with the PROVIDER role can create a provider profile."
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