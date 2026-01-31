import Navbar from '../components/Navbar';
import Link from 'next/link';
import { tools } from '../constants/tools';


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
     {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-16 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Every tool you need to work with PDFs
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          All the tools you need to use PDFs, at your fingertips. All are 100% FREE!
        </p>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-6 -mt-8"> 
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Link 
              key={tool.slug} 
              href={`/tools/${tool.slug}`} // <--- DYNAMIC LINK
              className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-start hover:-translate-y-1"
            >
              <div className={`p-3 rounded-lg bg-gray-50 mb-4 group-hover:scale-110 transition-transform ${tool.color}`}>
                <tool.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {tool.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}