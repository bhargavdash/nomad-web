"use client";

import * as React from "react";
import { Search, MapPin, X } from "lucide-react";
import usePhotonSearch, {
  getDisplayLabel,
  getSubtitle,
  type PhotonFeature,
} from "@/hooks/usePhotonSearch";
import { cn } from "@/lib/utils";

interface LocationSearchInputProps {
  value: string;
  onSelect: (label: string) => void;
  placeholder?: string;
}

export function LocationSearchInput({
  value,
  onSelect,
  placeholder = "Where do you want to go?",
}: LocationSearchInputProps) {
  const [query, setQuery] = React.useState(value);
  const [focused, setFocused] = React.useState(false);
  const { results, loading } = usePhotonSearch(focused ? query : "");

  React.useEffect(() => {
    if (value !== query && !focused) setQuery(value);
  }, [value, query, focused]);

  const handlePick = (feature: PhotonFeature) => {
    const label = getDisplayLabel(feature);
    setQuery(label);
    onSelect(label);
    setFocused(false);
  };

  const open = focused && query.length >= 2 && (results.length > 0 || loading);

  return (
    <div className="relative">
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() =>
            setTimeout(() => {
              setFocused(false);
              if (!query.trim()) onSelect("");
            }, 200)
          }
          placeholder={placeholder}
          className={cn(
            "h-14 w-full rounded-[16px] border-[1.5px] border-[var(--color-border-soft)] bg-[var(--color-warm-white)] pl-12 pr-12 font-sans text-[16px] text-[var(--color-ink)] placeholder:text-[var(--color-muted)] outline-none transition-all",
            "focus:border-[var(--color-ember)] focus:ring-[3px] focus:ring-[var(--color-ember)]/15",
          )}
        />
        {query && (
          <button
            type="button"
            aria-label="Clear location"
            onMouseDown={(e) => {
              e.preventDefault();
              setQuery("");
              onSelect("");
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-cream-2)] hover:text-[var(--color-ink)]"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-[16px] border-[1.5px] border-[var(--color-border-soft)] bg-[var(--color-warm-white)] shadow-card-hover">
          {loading && results.length === 0 ? (
            <div className="px-5 py-4 text-[13px] text-[var(--color-muted)]">Searching…</div>
          ) : (
            results.map((f, i) => (
              <button
                key={`${f.name}-${i}`}
                type="button"
                onMouseDown={() => handlePick(f)}
                className="flex w-full items-start gap-3 px-5 py-3 text-left transition-colors hover:bg-[var(--color-cream)]"
              >
                <MapPin size={16} className="mt-1 shrink-0 text-[var(--color-ember)]" />
                <div>
                  <div className="text-[14px] font-medium text-[var(--color-ink)]">{f.name}</div>
                  <div className="text-[12px] text-[var(--color-muted)]">{getSubtitle(f)}</div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
