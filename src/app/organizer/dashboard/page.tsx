"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface OrgEvent {
  id: string;
  title: string;
  category: string;
  venue: string;
  startDate: string;
  startTime: string;
  status: string;
  spotsLeft: number | null;
  capacity: number | null;
  _count: { bookings: number };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OrganizerDashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<OrgEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [orgName, setOrgName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("organizer-token");
    if (!token) {
      router.push("/organizer/login");
      return;
    }

    const info = localStorage.getItem("organizer-info");
    if (info) {
      const parsed = JSON.parse(info);
      setOrgName(parsed.organization || parsed.name);
    }

    fetch("/api/organizer/events", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) {
          localStorage.removeItem("organizer-token");
          router.push("/organizer/login");
          return [];
        }
        return r.json();
      })
      .then((data) => {
        if (data) setEvents(data);
        setLoading(false);
      });
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("organizer-token");
    localStorage.removeItem("organizer-info");
    router.push("/organizer/login");
  }

  async function handleDelete(eventId: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    const token = localStorage.getItem("organizer-token");
    await fetch(`/api/organizer/events/${eventId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setEvents(events.filter((e) => e.id !== eventId));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Organiser Dashboard</h1>
          {orgName && (
            <p className="text-muted mt-1">Welcome, {orgName}</p>
          )}
        </div>
        <div className="flex gap-3">
          <Link
            href="/organizer/events/new"
            className="bg-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            + Create Event
          </Link>
          <button
            onClick={handleLogout}
            className="border border-gray-300 px-4 py-2.5 rounded-lg text-muted hover:text-foreground transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-xl border border-gray-100">
          <p className="text-6xl mb-4">📋</p>
          <h2 className="text-xl font-bold mb-2">No events yet</h2>
          <p className="text-muted mb-6">
            Start by creating your first arts event — it&apos;s completely free!
          </p>
          <Link
            href="/organizer/events/new"
            className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors"
          >
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-sm text-muted">
                <tr>
                  <th className="px-6 py-3 font-semibold">Event</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Venue</th>
                  <th className="px-6 py-3 font-semibold">Bookings</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-xs text-muted">{event.category}</p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {formatDate(event.startDate)}
                      <br />
                      <span className="text-muted">{event.startTime}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">{event.venue}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="font-semibold">{event._count.bookings}</span>
                      {event.capacity && (
                        <span className="text-muted"> / {event.capacity}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          event.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/organizer/events/${event.id}/edit`}
                          className="text-sm text-primary hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(event.id, event.title)}
                          className="text-sm text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
