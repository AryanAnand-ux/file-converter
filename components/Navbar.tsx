import Link from 'next/link';
import { RefreshCw } from 'lucide-react'; // Importing an icon

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm">
      {/* Logo Area */}
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <div className="bg-blue-600 p-2 rounded-lg">
          <RefreshCw className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">
          Convert<span className="text-blue-600">IO</span>
        </span>
      </Link>

      {/* Navigation Links (Placeholder for now) */}
      <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
        <Link href="https://github.com" target="_blank" className="hover:text-blue-600 transition-colors">
          GitHub
        </Link>
      </div>
    </nav>
  );
}