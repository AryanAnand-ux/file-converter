import { notFound } from 'next/navigation';
import { tools } from '../../../constants/tools';
import Navbar from '../../../components/Navbar';
import Dropzone from '../../../components/Dropzone';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all tools
        </Link>

        <div className="text-center max-w-xl mx-auto mb-10">
          <div className={`inline-flex p-3 rounded-lg bg-gray-50 mb-4 ${tool.color}`}>
            <tool.icon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            {tool.title}
          </h1>
          <p className="text-gray-600">
            {tool.description}
          </p>
        </div>

        <Dropzone toolSlug={slug} />
      </div>
    </main>
  );
}
