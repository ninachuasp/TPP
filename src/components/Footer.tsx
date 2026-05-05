import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span>🎭</span> SG Arts & Culture
            </h3>
            <p className="text-gray-300 text-sm">
              Your one-stop platform for discovering and booking arts and
              cultural events in Singapore.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/" className="hover:text-accent">Browse Events</Link></li>
              <li><Link href="/my-calendar" className="hover:text-accent">My Calendar</Link></li>
              <li><Link href="/organizer/register" className="hover:text-accent">List Your Event (Free)</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">For Organisers</h4>
            <p className="text-gray-300 text-sm mb-3">
              List your arts and cultural events for free. Reach thousands of
              culture enthusiasts in Singapore.
            </p>
            <Link
              href="/organizer/register"
              className="inline-block bg-accent text-secondary px-4 py-2 rounded-lg font-semibold text-sm hover:bg-amber-400 transition-colors"
            >
              Register as Organiser
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} SG Arts & Culture. Made with ❤️ for Singapore&apos;s arts community.</p>
        </div>
      </div>
    </footer>
  );
}
