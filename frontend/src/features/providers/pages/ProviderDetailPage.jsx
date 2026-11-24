
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Globe, BadgeCheck } from "lucide-react";
import { apiRequest } from "../../../services/api";

export default function ProviderDetailPage() {
    const { id } = useParams();
    const [provider, setProvider] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        async function loadProvider() {
            try {
                setLoading(true);
                setError("");
                const [providerResponse, servicesResponse] = await Promise.all([
                    apiRequest(`/api/providers/${id}`),
                    apiRequest(`/api/providers/${id}/services`),
                ]);
                if (!cancelled) {
                    setProvider(providerResponse.data);
                    setServices(
                        Array.isArray(servicesResponse.data) ? servicesResponse.data : []
                    );
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "Failed to load provider.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }
        loadProvider();
        return () => {
            cancelled = true;
        };
    }, [id]);

    return (
        <main className="!block min-h-screen bg-white px-5 py-10 sm:px-8">
            <div className="mx-auto max-w-5xl">
                <Link to="/providers" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-black">
                    <ArrowLeft size={16} /> Back to providers
                </Link>
                {loading && (
                    <p className="text-neutral-500">Loading provider profile...</p>
                )}
                {!loading && error && (
                    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                        {error}
                    </div>
                )}
                {!loading && !error && provider && (
                    <>
                        <section className="mb-8 overflow-hidden rounded-3xl border border-neutral-200">
                            <div className="h-36 bg-neutral-950 sm:h-44" />
                            <div className="px-6 pb-7 sm:px-8">
                                <div className="-mt-10 mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-neutral-100 text-3xl font-bold text-neutral-900">
                                    {provider.businessName?.charAt(0)?.toUpperCase() || "P"}
                                </div>
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <div className="mb-2 flex flex-wrap items-center gap-3">
                                            <h1 className="text-3xl font-bold tracking-tight text-neutral-950">
                                                {provider.businessName}
                                            </h1>
                                            {provider.verified && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium">
                                                    <BadgeCheck size={14} /> Verified
                                                </span>
                                            )}
                                        </div>
                                        <p className="flex items-center gap-2 text-neutral-500">
                                            <MapPin size={16} />
                                            {provider.location || "Location not provided"}
                                        </p>
                                    </div>
                                    {provider.websiteUrl && (
                                        <a
                                            href={provider.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800">
                                            <Globe size={16} /> Visit website
                                        </a>
                                    )}
                                </div>
                            </div>
                        </section>
                        <div className="grid gap-8 lg:grid-cols-3">
                            <div className="space-y-8 lg:col-span-2">
                                <section className="rounded-2xl border border-neutral-200 p-7">
                                    <h2 className="mb-4 text-xl font-semibold text-neutral-950">About this provider</h2>
                                    <p className="whitespace-pre-line leading-7 text-neutral-600">
                                        {provider.description || "This provider hasn't added a description yet. "}
                                    </p>
                                </section>
                                <section className="rounded-2xl border border-neutral-200 p-7">
                                    <div className="mb-5 flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-neutral-950">Services</h2>
                                        <span className="text-sm text-neutral-500">{services.length} available</span>
                                    </div>
                                    {services.length === 0 ? (
                                        <p className="text-neutral-500">No services listed yet.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {services.map((service) => (
                                                <div key={service.id} className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                                                    <h3 className="font-semibold text-neutral-950">
                                                        {service.name || service.title || "Service"}
                                                    </h3>
                                                    {service.description && (
                                                        <p className="mt-2 text-sm leading-6 text-neutral-600">{service.description}</p>
                                                    )}
                                                    {service.price != null && (
                                                        <p className="mt-3 text-sm font-semibold text-neutral-950">{service.price} MAD</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            </div>
                            <aside className="h-fit rounded-2xl border border-neutral-200 p-7">
                                <h2 className="mb-3 text-lg font-semibold text-neutral-950">Provider information</h2>
                                <p className="mb-2 text-sm text-neutral-500">Location</p>
                                <p className="mb-6 font-medium text-neutral-900">{provider.location || "Not provided"}</p>
                                {provider.websiteUrl && (
                                    <a href={provider.websiteUrl} target="_blank" rel="noopener noreferrer" className="block w-full rounded-xl border border-neutral-300 px-4 py-3 text-center text-sm font-medium hover:bg-neutral-50">View website</a>
                                )}
                                <p className="mt-5 text-xs leading-5 text-neutral-500">
                                    Contact and booking features will be available when those modules are connected.
                                </p>
                            </aside>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
