import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-150 py-3.5 px-6 flex justify-between items-center shadow-sm transition-all duration-300">
      {/* Logo Area */}
      <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
        <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl shadow-md shadow-blue-500/15 group-hover:scale-105 group-hover:rotate-12 transition-all duration-300">
          <RefreshCw className="text-white w-4.5 h-4.5 animate-spin-slow" />
        </div>
        <span className="text-lg font-extrabold text-slate-800 tracking-tight">
          Convert<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">IO</span>
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-500">
        <Link 
          href="/" 
          className="hover:text-blue-600 transition-colors duration-250 relative py-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300"
        >
          Home
        </Link>
        <a 
          href="https://github.com/AryanAnand-ux/file-converter" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors duration-250 relative py-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300"
        >
          GitHub
        </a>
      </div>
    </nav>
  );
}