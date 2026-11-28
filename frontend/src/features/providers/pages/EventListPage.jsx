import { useEffect, useState, useMemo } from 'react';
import EventCard from '../components/EventCard';
import { apiRequest } from '../../../services/api';
import ProviderSearchBar from '../components/ProviderSearchBar';
import ProviderFilters from '../components/ProviderFilters';
import { Logout } from '../../auth/components/logout/Logout';

export default function EventListPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        let cancelled = false;
        async function loadEvents() {
            try {
                setLoading(true);
                setError("");
                const response = await apiRequest("/api/events");
                if(!cancelled)
                {
                    setEvents(response);
                }
            } catch (err) {
                if(!cancelled)
                {
                    setError(err.message || "Failed to load events.");
                }
            } finally {
                if(!cancelled) {
                    setLoading(false);
                }
            }
        }
        loadEvents();
        return() => {
            cancelled = true;
        }
    }, []);
const filteredEvents = useMemo(() => {
    return events.filter((event) => {
        const keyword = search.trim().toLowerCase();
        const matchesSearch = !keyword || [event.title, event.description, event.eventType].some(
            (value) => String(value ?? "").toLowerCase().includes(keyword));
        const matchesLocation = !location.trim() || String(event.location ?? "")
            .toLowerCase()
            .includes(location.trim().toLowerCase());
        const matchesCategory = !category || String(event.eventType ?? "").toLowerCase() ===
            category.toLowerCase();
        const budget = Number(event.budget);
        const matchesMin = minPrice === "" || budget >= Number(minPrice);
        const matchesMax = maxPrice === "" || budget <= Number(maxPrice);
        return (
            matchesSearch &&
            matchesLocation &&
            matchesCategory &&
            matchesMin &&
            matchesMax
        );
    });
}, [events, search, location, category, minPrice, maxPrice]);
const PAGE_SIZE = 9;
const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
const visibleEvents = filteredEvents.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
);
function clearFilters() {
  setSearch("");
  setLocation("");
  setCategory("");
  setMinPrice("");
  setMaxPrice("");
  setPage(1);
}
return (
  <main className="!block min-h-screen bg-white px-5 py-12 sm:px-8">
    <Logout> </Logout>
    <div className="mx-auto w-full max-w-6xl">
        <section className="relative mb-4 overflow-hidden rounded-3xl bg-neutral-950 px-6 py-3 text-white sm:px-8 sm:py-4">
            <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border border-white/15" />
            <div className="pointer-events-none absolute -right-4 -top-8 h-52 w-32 rounded-full border border-white/15" />

            <div className="relative z-10 max-w-2xl">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">EventMatch / Discover</p>
                <h1 className="mb-2 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">Find your next
                    <span className="block text-neutral-400">event opportunity.</span>
                </h1>
                <p className="mb-3 max-w-lg text-base leading-relaxed text-neutral-300">
                    Discover events created by organizersand find opportunities
                    that match your services.
                </p>
                <div className="flex flex-wrap gap-2">
                    {["Wedding", "Birthday", "Conference", "Corporate"].map(
                        (item) => (
                            <button key={item} type="button" onClick={() => {setCategory(item); setPage(1);}}
                            className={`rounded-full border px-4 py-2 text-sm transition ${category === item ? "border-white bg-white text-black" : "border-white/25 text-white hover:border-white hover:bg-white/10"}`}>
                                {item}
                            </button>                
                        )
                    )}
                </div>
            </div>
        </section>

      {/* Search and filters card */}
      <section className="mb-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6">
          <ProviderSearchBar
            search={search}
            onSearchChange={(value) => { 
                setSearch(value);
                setPage(1);
            }}
          />

          <ProviderFilters
            location={location}
            category={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onLocationChange={(value) => {
                setLocation(value);
                setPage(1);
            }}
            onCategoryChange={(value) => {
                setCategory(value);
                setPage(1);
            }}
            onMinPriceChange={(value) => {
                setMinPrice(value);
                setPage(1);
            }}
            onMaxPriceChange={(value) => {
                setMaxPrice(value);
                setPage(1);
            }}
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 font-medium text-black transition hover:bg-neutral-100"
            >
              Clear filters
            </button>
          </div>
        </div>
      </section>

      {/* Loading state */}
      {loading && (
        <p className="text-neutral-500">
          Loading events...
        </p>
      )}

      {/* Error state */}
      {!loading && error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}

      {/* Empty state */}
      {!loading && !error && filteredEvents.length === 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
          <h2 className="mb-3 text-xl font-semibold text-black">
            No events found
          </h2>
          <p className="text-neutral-500">
            Try adjusting your search or filters.
          </p>
        </div>
      )}

      {/* Event cards */}
      {!loading && !error && visibleEvents.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleEvents.map((event) => (
                <EventCard
                key={event.id}
                event={event}
                />
            ))}
        </div>
       )}     
      {!loading && !error && totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
            <button type="button" disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-xl border border-neutral-300 bg-white px-5 py-3 font-medium text-black transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40">
                ← Previous
            </button>
            <span className="text-sm font-semibold text-neutral-700">
                Page {page} of {totalPages}
            </span>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}
            className="rounded-xl bg-neutral-950 px-5 py-3 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40">
                Next →
            </button>
        </div>
      )}
    </div>
  </main>
);

}
