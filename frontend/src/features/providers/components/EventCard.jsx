
export default function EventCard({ event }) {
  const eventDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString()
    : "Date not specified";

  const budget =
    event.budget != null
      ? `${Number(event.budget).toLocaleString()} MAD`
      : "Not specified";

  return (
    <article className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-400 hover:shadow-md">
      {/* Event type */}
      <div className="mb-4">
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
          {event.eventType || "Event"}
        </span>
      </div>

      {/* Event title */}
      <h3 className="mb-3 text-xl font-semibold tracking-tight text-neutral-950">
        {event.title}
      </h3>

      {/* Description */}
      <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-neutral-600">
        {event.description || "No description available."}
      </p>

      {/* Event information */}
      <div className="mb-6 space-y-3 text-sm text-neutral-700">
        <div className="flex items-center gap-2">
          <span>📍</span>
          <span>{event.location || "Location not specified"}</span>
        </div>

        <div className="flex items-center gap-2">
          <span>📅</span>
          <span>{eventDate}</span>
        </div>

        <div className="flex items-center gap-2">
          <span>👥</span>
          <span>{event.guestCount ?? "—"} guests</span>
        </div>
      </div>

      {/* Budget and action */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-neutral-200 pt-4">
        <div>
          <p className="mb-1 text-xs text-neutral-500">
            Event budget
          </p>

          <p className="text-lg font-semibold text-neutral-950">
            {budget}
          </p>
        </div>

        <button
          type="button"
          disabled
          title="Event details coming soon"
          className="cursor-not-allowed rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white opacity-60"
        >
          View Event →
        </button>
      </div>
    </article>
  );
}
