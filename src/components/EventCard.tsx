import Link from "next/link";

interface EventCardProps {
  id: string;
  title: string;
  category: string;
  venue: string;
  startDate: string;
  startTime: string;
  endTime: string;
  isFree: boolean;
  price: number;
  imageUrl?: string | null;
  spotsLeft?: number | null;
  organizer?: { name: string; organization?: string | null };
}

const categoryColors: Record<string, string> = {
  "Theatre & Drama": "bg-purple-100 text-purple-800",
  "Music & Concerts": "bg-blue-100 text-blue-800",
  "Dance": "bg-pink-100 text-pink-800",
  "Visual Arts": "bg-green-100 text-green-800",
  "Film & Media": "bg-yellow-100 text-yellow-800",
  "Literary Arts": "bg-indigo-100 text-indigo-800",
  "Heritage & Culture": "bg-red-100 text-red-800",
  "Festivals": "bg-orange-100 text-orange-800",
  "Workshops & Classes": "bg-teal-100 text-teal-800",
  "Comedy": "bg-amber-100 text-amber-800",
  "Photography": "bg-cyan-100 text-cyan-800",
  "Craft & Design": "bg-rose-100 text-rose-800",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-SG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EventCard({
  id,
  title,
  category,
  venue,
  startDate,
  startTime,
  endTime,
  isFree,
  price,
  imageUrl,
  spotsLeft,
  organizer,
}: EventCardProps) {
  const colorClass = categoryColors[category] || "bg-gray-100 text-gray-800";

  return (
    <Link href={`/events/${id}`} className="group block">
      <div className="bg-surface rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:-translate-y-1">
        <div className="h-48 bg-gradient-to-br from-secondary to-primary/80 flex items-center justify-center relative">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl opacity-80">🎨</span>
          )}
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colorClass}`}>
              {category}
            </span>
          </div>
          {isFree && (
            <div className="absolute top-3 right-3">
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                FREE
              </span>
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="space-y-1.5 text-sm text-muted">
            <p className="flex items-center gap-2">
              <span>📅</span>
              {formatDate(startDate)}
            </p>
            <p className="flex items-center gap-2">
              <span>🕐</span>
              {startTime} – {endTime}
            </p>
            <p className="flex items-center gap-2">
              <span>📍</span>
              <span className="truncate">{venue}</span>
            </p>
            {organizer && (
              <p className="flex items-center gap-2">
                <span>🏢</span>
                <span className="truncate">{organizer.organization || organizer.name}</span>
              </p>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-bold text-primary">
              {isFree ? "Free" : `S$${price.toFixed(2)}`}
            </span>
            {spotsLeft !== null && spotsLeft !== undefined && (
              <span className={`text-xs font-semibold ${spotsLeft < 10 ? "text-red-500" : "text-muted"}`}>
                {spotsLeft} spots left
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
