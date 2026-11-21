export default function ProviderFilter({ filters, category, minPrice, maxPrice, onLocationChange, onCategoryChange, onMinPriceChange, onMaxPriceChange })
{
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
                <label htmlFor="location" className="mb-2 block text-sm font-medium">Location</label>
                <input id="location" className="block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-black placeholder:text-neutral-400 focus:border-black focus:outline-none" placeholder="e.g. Rabat" value={location} 
                onChange={(e) => onLocationChange(e.target.value) }/>
            </div>
            <div>
                <label htmlFor="category" className="mb-2 block text-sm font-medium">Category</label>
                <input id="category" className="block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-black placeholder:text-neutral-400 focus:border-black focus:outline-none" placeholder="e.g. Photography" value={category}
                onChange={(e) => onCategoryChange(e.target.value)} />
            </div>
            <div>
                <label htmlFor="min-price" className="mb-2 block text-sm font-medium">Minimum price</label>
                <input id="min-price" type="number" min="0" className="block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-black placeholder:text-neutral-400 focus:border-black focus:outline-none" placeholder="Min" value={minPrice}
                onChange={(e) => onMinPriceChange(e.target.value)} />
            </div>
            <div>
                <label htmlFor="max-price" className="mb-2 block text-sm font-mediun">Maximum price</label>
                <input id="max-price" type="number" min="0" className="block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-black placeholder:text-neutral-400 focus:border-black focus:outline-none" placeholder="Max" value={maxPrice}
                onChange={(e) => onMaxPriceChange(e.target.value)} />
            </div>
        </div>
    );
}