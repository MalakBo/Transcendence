import { useEffect, useState } from "react";
import { apiRequest } from "../../../services/api";

export default function ProviderServiceForm({ providerId, onServiceCreated, serviceToEdit, onServiceUpdated, onCancel, }) {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [pricingType, setPricingType] = useState("FIXED");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const isEditing = Boolean(serviceToEdit);


    useEffect(() => {
        setName(serviceToEdit?.name ?? "");
        setCategoryId(serviceToEdit?.categoryId ?? "");
        setDescription(serviceToEdit?.description ?? "");
        setPrice(serviceToEdit?.price != null ? String(serviceToEdit.price) : "");
        setPricingType(serviceToEdit?.pricingType ?? "FIXED");
        setError("");
        setSuccess("");
    }, [serviceToEdit]);
    useEffect(() => {
        async function loadCategories() {
            try {
                const response = await apiRequest("/api/providers/categories");
                setCategories(response.data || []);
            } catch (err) {
                setError(err.message || "Failed to load categories.");
            }
        }
        loadCategories();
    }, []);
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        
        try {
            const endpoint = isEditing
                ? `/api/providers/${providerId}/services/${serviceToEdit.id}`
                : `/api/providers/${providerId}/services`;
            const response = await apiRequest(endpoint, {
                method: isEditing ? "PATCH" : "POST",
                body: {
                    categoryId,
                    name: name.trim(),
                    description: description.trim(),
                    price: Number(price),
                    pricingType,
                },
            });
            if (isEditing) {
                onServiceUpdated?.(response.data);
            } else {
                setSuccess("Service added successfully!");
                setName("");
                setCategoryId("");
                setDescription("");
                setPrice("");
                setPricingType("FIXED");
                onServiceCreated?.(response.data);
            }
        } catch (err) {
            setError(err.message || "Failed to create service.");
        } finally {
            setLoading(false);
        }
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-950">{isEditing ? "Edit service" : "Add a service"}</h3>
            <div>
                <label htmlFor="service-name" className="mb-2 block text-sm font-medium">Service name</label>
                <input id="service-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Wedding Photography" className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"/>
            </div>
            <div>
                <label htmlFor="service-category" className="mb-2 block text-sm font-medium">Category</label>
                <select id="service-category" required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-black">
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="service-description" className="mb-2 block text-sm font-medium">Description</label>
                <textarea
                    id="service-description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your service..."
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
                />
            </div>
            <div>
                <label htmlFor="service-price" className="mb-2 block text-sm font-medium">Price (MAD)</label>
                <input
                    id="service-price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="2500"
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
                />
            </div>
            <div>
                <label htmlFor="service-pricing" className="mb-2 block text-sm font-medium">Pricing type</label>
                <select
                    id="service-pricing"
                    value={pricingType}
                    onChange={(e) => setPricingType(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-black">
                    <option value="FIXED">Fixed price</option>
                    <option value="PER_HOUR">Per hour</option>
                    <option value="PER_GUEST">Per guest</option>
                    <option value="CUSTOM">Custom</option>
                </select>
            </div>
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-700">{success}</p>}

            <div className="flex items-center gap-3">
                <button type="submit" disabled={loading || categories.length === 0}
                className="rounded-xl bg-neutral-950 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50">
                    {loading ? "Saving..." : isEditing ? "Save changes" : "Add Service"}
                </button>
                {isEditing && ( 
                    <button type="button" onClick={onCancel} disabled={loading}
                    className="rounded-xl border border-neutral-300 px-6 py-3 text-sm font-medium hover:bg-neutral-100">
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}