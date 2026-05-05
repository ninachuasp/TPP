"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Booking {
  id: string;
  tickets: number;
  status: string;
  event: {
    id: string;
    title: string;
    category: string;
    venue: string;
    address: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    isFree: boolean;
    price: number;
    organizer: { name: string; organization: string | null };
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-SG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getMonthYear(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-SG", {
    month: "long",
    year: "numeric",
  });
}

export default function MyCalendarPage() {
  const [email, setEmail] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sg-arts-email");
    if (saved) {
      setEmail(saved);
      setEmailInput(saved);
      fetchBookings(saved);
    }
  }, []);

  async function fetchBookings(e: string) {
    setLoading(true);
    setSearched(true);
    const res = await fetch(`/api/bookings?email=${encodeURIComponent(e)}`);
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmail(emailInput);
    localStorage.setItem("sg-arts-email", emailInput);
    fetchBookings(emailInput);
  }

  // Group bookings by month
  const grouped = bookings.reduce(
    (acc, b) => {
      const key = getMonthYear(b.event.startDate);
      if (!acc[key]) acc[key] = [];
      acc[key].push(b);
      return acc;
    },
    {} as Record<string, Booking[]>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">My Events Calendar</h1>
      <p className="text-muted mb-8">
        View and manage your booked events. Download calendar files to add them
        to your favourite calendar app.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <input
          type="email"
          required
          placeholder="Enter your email to view bookings"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          View My Events
        </button>
      </form>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        </div>
      )}

      {!loading && searched && bookings.length === 0 && (
        <div className="text-center py-16 bg-surface rounded-xl border border-gray-100">
          <p className="text-5xl mb-4">📅</p>
          <h2 className="text-xl font-bold mb-2">No bookings found</h2>
          <p className="text-muted mb-4">
            No events booked with this email yet.
          </p>
          <Link
            href="/"
            className="text-primary font-semibold hover:underline"
          >
            Browse events →
          </Link>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="space-y-8">
          {Object.entries(grouped).map(([month, monthBookings]) => (
            <div key={month}>
              <h2 className="text-xl font-bold text-secondary mb-4 border-b border-gray-200 pb-2">
                {month}
              </h2>
              <div className="space-y-4">
                {monthBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-surface rounded-xl border border-gray-100 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="bg-primary/10 text-primary rounded-lg p-3 text-center min-w-[70px]">
                      <p className="text-2xl font-bold">
                        {new Date(booking.event.startDate).getDate()}
                      </p>
                      <p className="text-xs font-semibold uppercase">
                        {new Date(booking.event.startDate).toLocaleDateString(
                          "en-SG",
                          { weekday: "short" }
                        )}
                      </p>
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/events/${booking.event.id}`}
                        className="font-bold text-lg hover:text-primary transition-colors"
                      >
                        {booking.event.title}
                      </Link>
                      <div className="text-sm text-muted mt-1 space-y-0.5">
                        <p>
                          🕐 {booking.event.startTime} – {booking.event.endTime}
                        </p>
                        <p>📍 {booking.event.venue}</p>
                        <p>🎟️ {booking.tickets} ticket{booking.tickets > 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <a
                      href={`/api/calendar?bookingId=${booking.id}`}
                      className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition whitespace-nowrap"
                    >
                      📅 Add to Calendar
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
