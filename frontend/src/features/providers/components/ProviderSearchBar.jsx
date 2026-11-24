export default function ProviderSearchBar({ search, onSearchChange})
{
    return (
        <div className="w-full">
            <label htmlFor="provider-search" className="mb-2 block text-sm font-semibold text-black">
                Search Providers
            </label>
            <input id="provider-search" type="search" placeholder="Search events by name or keyword..." value={search} 
            onChange={(event) => onSearchChange(event.target.value)}
            className="block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-black placeholder:text-neutral-400 focus:border-black focus:outline-none"
            />
        </div>
    );
}