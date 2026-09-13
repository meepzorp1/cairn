"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { MapPin } from "lucide-react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export type PlaceSelection = {
  placeId: string;
  name: string;
  address: string;
  location: { latitude: number; longitude: number };
};

type Suggestion = {
  placeId: string;
  mainText: string;
  mainTextMatches: { startOffset: number; endOffset: number }[];
  secondaryText: string;
  prediction: google.maps.places.PlacePrediction;
};

type PlaceAutocompleteInputProps = {
  id: string;
  placeholder?: string;
  onSelect: (place: PlaceSelection) => void;
};

const DEBOUNCE_MS = 200;

export default function PlaceAutocompleteInput({
  id,
  placeholder,
  onSelect,
}: PlaceAutocompleteInputProps) {
  const placesLibrary = useMapsLibrary("places");

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () =>
      document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const runSearch = useCallback(
    async (input: string) => {
      if (!placesLibrary) return;

      const thisRequestId = ++requestIdRef.current;
      setIsLoading(true);

      if (!sessionTokenRef.current) {
        sessionTokenRef.current =
          new placesLibrary.AutocompleteSessionToken();
      }

      try {
        const { suggestions: results } =
          await placesLibrary.AutocompleteSuggestion.fetchAutocompleteSuggestions(
            {
              input,
              sessionToken: sessionTokenRef.current,
            },
          );

        if (thisRequestId !== requestIdRef.current) return;

        const mapped: Suggestion[] = results
          .map((result) => result.placePrediction)
          .filter(
            (prediction): prediction is google.maps.places.PlacePrediction =>
              prediction !== null,
          )
          .map((prediction) => ({
            placeId: prediction.placeId,
            mainText: prediction.mainText?.text ?? prediction.text.text,
            mainTextMatches: prediction.mainText?.matches ?? [],
            secondaryText: prediction.secondaryText?.text ?? "",
            prediction,
          }));

        setSuggestions(mapped);
        setActiveIndex(mapped.length > 0 ? 0 : -1);
      } catch (error) {
        console.error("Autocomplete request failed:", error);
        setSuggestions([]);
        setActiveIndex(-1);
      } finally {
        if (thisRequestId === requestIdRef.current) setIsLoading(false);
      }
    },
    [placesLibrary],
  );

  const handleChange = (value: string) => {
    setQuery(value);
    setIsOpen(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      requestIdRef.current += 1;
      setSuggestions([]);
      setIsLoading(false);
      setActiveIndex(-1);
      return;
    }

    debounceRef.current = setTimeout(() => {
      void runSearch(trimmed);
    }, DEBOUNCE_MS);
  };

  const selectSuggestion = async (item: Suggestion) => {
    try {
      const place = item.prediction.toPlace();
      const { place: detailed } = await place.fetchFields({
        fields: ["id", "displayName", "formattedAddress", "location"],
      });

      const location = detailed.location;

      if (!detailed.id || !detailed.displayName || !location) return;

      onSelect({
        placeId: detailed.id,
        name: detailed.displayName,
        address: detailed.formattedAddress ?? detailed.displayName,
        location: {
          latitude: location.lat(),
          longitude: location.lng(),
        },
      });

      setQuery(detailed.displayName);
      setIsOpen(false);
      setSuggestions([]);
      // The session concludes once fetchFields is called for a selection.
      sessionTokenRef.current = null;
    } catch (error) {
      console.error("Failed to fetch place details:", error);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (current) => (current - 1 + suggestions.length) % suggestions.length,
      );
    } else if (event.key === "Enter") {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        event.preventDefault();
        void selectSuggestion(suggestions[activeIndex]);
      }
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const showDropdown =
    isOpen && (isLoading || suggestions.length > 0 || query.trim().length > 0);

  return (
    <div ref={containerRef} className="relative">
      <MapPin className="pointer-events-none absolute left-3 top-1/2 z-10 size-5 -translate-y-1/2 text-cairn-muted" />

      <input
        id={id}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen && suggestions.length > 0}
        aria-controls={`${id}-listbox`}
        aria-activedescendant={
          activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined
        }
        autoComplete="off"
        placeholder={placeholder}
        value={query}
        onChange={(event) => handleChange(event.target.value)}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className="relative w-full rounded-xl border border-cairn-border/70 bg-cairn-card py-3 pl-11 pr-4 text-sm text-cairn-text outline-none transition placeholder:text-cairn-muted focus:border-cairn-gold/60 focus:ring-2 focus:ring-cairn-gold/20"
      />

      {showDropdown && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-cairn-border/70 bg-cairn-card shadow-[0_20px_45px_rgba(2,6,23,0.55)]"
        >
          {isLoading && suggestions.length === 0 ? (
            <li className="px-4 py-3 text-sm text-cairn-muted">Searching…</li>
          ) : suggestions.length === 0 ? (
            <li className="px-4 py-3 text-sm text-cairn-muted">
              No matches found.
            </li>
          ) : (
            suggestions.map((item, index) => (
              <li key={item.placeId} role="presentation">
                <button
                  id={`${id}-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => void selectSuggestion(item)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition ${
                    index > 0 ? "border-t border-cairn-border/50" : ""
                  } ${
                    index === activeIndex
                      ? "bg-cairn-gold-soft"
                      : "hover:bg-cairn-raised"
                  }`}
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-cairn-gold" />

                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-cairn-text">
                      {renderHighlighted(item.mainText, item.mainTextMatches)}
                    </span>
                    {item.secondaryText && (
                      <span className="block truncate text-xs text-cairn-muted">
                        {item.secondaryText}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

function renderHighlighted(
  text: string,
  matches: { startOffset: number; endOffset: number }[],
) {
  if (matches.length === 0) return text;

  const segments: { text: string; matched: boolean }[] = [];
  let cursor = 0;

  for (const { startOffset, endOffset } of matches) {
    if (startOffset > cursor) {
      segments.push({ text: text.slice(cursor, startOffset), matched: false });
    }
    if (endOffset > startOffset) {
      segments.push({ text: text.slice(startOffset, endOffset), matched: true });
    }
    cursor = Math.max(cursor, endOffset);
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), matched: false });
  }

  return segments.map((segment, index) =>
    segment.matched ? (
      <strong key={index} className="text-cairn-gold">
        {segment.text}
      </strong>
    ) : (
      <span key={index}>{segment.text}</span>
    ),
  );
}
