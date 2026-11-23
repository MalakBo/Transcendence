import { Link } from 'react-router-dom';

export default function ProviderCard({ provider}) {
    return (
        <article className="card card-hover flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold">{provider.businessName}</h2>
                {provider.verified && (<span className="rounded-full bg-secondary px-3 py-1 text-xs">Verified</span>)}
            </div>
            <p className="text-muted text-sm">📍 {provider.location}</p>
            <p className="text-sm leading-relaxed">{provider.description || "No description available."}</p>
            <div className="mt-auto pt-3">
                <Link to={`/providers/${provider.id}`} className="btn btn-primary full-width">View Profile</Link>
            </div>
        </article>
    );
}