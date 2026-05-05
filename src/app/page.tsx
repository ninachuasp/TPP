"use client";

import { useState, useEffect } from "react";
import EventCard from "@/components/EventCard";
import { CATEGORIES } from "@/lib/categories";

interface Event {
  id: string;
  title: string;
  category: string;
  venue: string;
  startDate: string;
  startTime: string;
  endTime: string;
  isFree: boolean;
  price: number;
  imageUrl: string | null;
  spotsLeft: number | null;
  organizer: { name: string; organization: string | null };
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchEvents();
  }, [category, search]);

  async function fetchEvents() {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    const res = await fetch(`/api/events?${params}`);
    const data = await res.json();
    setEvents(data);
    setLoading(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary via-secondary to-primary/90 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Singapore Arts & Culture
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Discover and book the best arts, heritage and cultural events across
            the Lion City
          </p>
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
            <input
              type="text"
              placeholder="Search events, venues..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 px-5 py-3 rounded-lg text-foreground text-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              className="bg-accent text-secondary px-6 py-3 rounded-lg font-bold hover:bg-amber-400 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setCategory("")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === ""
                ? "bg-primary text-white"
                : "bg-white text-muted border border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            All Events
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat === category ? "" : cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-primary text-white"
                  : "bg-white text-muted border border-gray-200 hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🎭</p>
            <h2 className="text-2xl font-bold mb-2">No events found</h2>
            <p className="text-muted">
              {search || category
                ? "Try adjusting your search or filters."
                : "Check back soon — new events are added regularly!"}
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {category || "Upcoming Events"}
              <span className="text-muted text-base font-normal ml-2">
                ({events.length} event{events.length !== 1 ? "s" : ""})
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
