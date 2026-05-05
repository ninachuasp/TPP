"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  venue: string;
  address: string;
  imageUrl: string | null;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  price: number;
  isFree: boolean;
  capacity: number | null;
  spotsLeft: number | null;
  organizer: { name: string; organization: string | null; website: string | null };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-SG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [tickets, setTickets] = useState(1);
  const [bookingStatus, setBookingStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setEvent(data);
        setLoading(false);
      });
  }, [id]);

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    setBookingStatus("submitting");
    setErrorMsg("");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: id,
        name: bookingName,
        email: bookingEmail,
        tickets,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setBookingId(data.id);
      setBookingStatus("success");
      // Save email for calendar page
      localStorage.setItem("sg-arts-email", bookingEmail);
    } else {
      const data = await res.json();
      setErrorMsg(data.error || "Booking failed");
      setBookingStatus("error");
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <Link href="/" className="text-primary mt-4 inline-block">
          Back to events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/"
        className="text-muted hover:text-primary mb-6 inline-flex items-center gap-1"
      >
        ← Back to events
      </Link>

      <div className="bg-surface rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header Image */}
        <div className="h-64 md:h-80 bg-gradient-to-br from-secondary to-primary/80 flex items-center justify-center relative">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-8xl opacity-80">🎨</span>
          )}
          {event.isFree && (
            <span className="absolute top-4 right-4 bg-green-500 text-white px-4 py-1.5 rounded-full font-bold">
              FREE
            </span>
          )}
        </div>

        <div className="p-6 md:p-10">
          <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full mb-4">
            {event.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{event.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-xl">📅</span>
                <div>
                  <p className="font-semibold">Date</p>
                  <p className="text-muted">{formatDate(event.startDate)}</p>
                  {event.startDate !== event.endDate && (
                    <p className="text-muted">to {formatDate(event.endDate)}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🕐</span>
                <div>
                  <p className="font-semibold">Time</p>
                  <p className="text-muted">
                    {event.startTime} – {event.endTime}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <p className="font-semibold">{event.venue}</p>
                  <p className="text-muted">{event.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🏢</span>
                <div>
                  <p className="font-semibold">Organised by</p>
                  <p className="text-muted">
                    {event.organizer.organization || event.organizer.name}
                  </p>
                  {event.organizer.website && (
                    <a
                      href={event.organizer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-sm"
                    >
                      Visit website →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 mb-8">
            <h2 className="text-xl font-bold mb-3">About this event</h2>
            <div className="text-muted leading-relaxed whitespace-pre-wrap">
              {event.description}
            </div>
          </div>

          {/* Pricing & Booking */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {event.isFree ? "Free Admission" : `S$${event.price.toFixed(2)}`}
                </p>
                {event.spotsLeft !== null && (
                  <p
                    className={`text-sm ${event.spotsLeft < 10 ? "text-red-500 font-semibold" : "text-muted"}`}
                  >
                    {event.spotsLeft} spots remaining
                  </p>
                )}
              </div>
              {bookingStatus !== "success" && (
                <button
                  onClick={() => setShowBooking(true)}
                  disabled={event.spotsLeft === 0}
                  className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {event.spotsLeft === 0 ? "Fully Booked" : "Book Now"}
                </button>
              )}
            </div>

            {showBooking && bookingStatus !== "success" && (
              <form onSubmit={handleBooking} className="space-y-4 mt-4 border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="max-w-[200px]">
                  <label className="block text-sm font-medium mb-1">Tickets</label>
                  <input
                    type="number"
                    min={1}
                    max={event.spotsLeft ?? 10}
                    value={tickets}
                    onChange={(e) => setTickets(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {errorMsg && (
                  <p className="text-red-500 text-sm">{errorMsg}</p>
                )}
                <button
                  type="submit"
                  disabled={bookingStatus === "submitting"}
                  className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {bookingStatus === "submitting" ? "Booking..." : "Confirm Booking"}
                </button>
              </form>
            )}

            {bookingStatus === "success" && bookingId && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-bold text-green-800 mb-2">
                    Booking Confirmed!
                  </h3>
                  <p className="text-green-700 text-sm mb-3">
                    You&apos;ve booked {tickets} ticket{tickets > 1 ? "s" : ""} for{" "}
                    {event.title}.
                  </p>
                  <div className="flex gap-3">
                    <a
                      href={`/api/calendar?bookingId=${bookingId}`}
                      className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-colors"
                    >
                      📅 Add to Calendar (.ics)
                    </a>
                    <Link
                      href="/my-calendar"
                      className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
                    >
                      View My Calendar
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
