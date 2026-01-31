import { notFound } from 'next/navigation';
import { tools } from '../../../constants/tools'; // Make sure this path is correct!
import Navbar from '../../../components/Navbar';
import Dropzone from '../../../components/Dropzone';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// NOTE: We changed the type to Promise<{ slug: string }>
// and we added 'async' to the function component.
interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ToolPage({ params }: PageProps) {
    // Await the params to get the slug (Next.js 15 requirement)
    const { slug } = await params;

    // Debugging: Check your terminal to see if this prints when you click a link
    console.log("Current Slug:", slug);

    // 1. Find the tool that matches the URL
    const tool = tools.find((t) => t.slug === slug);

    // 2. If no tool is found, show 404
    if (!tool) {
        return notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="container mx-auto px-4 py-10">
                <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to all tools
                </Link>

                <div className="text-center mb-10">
                    <div className={`inline-flex p-4 rounded-2xl bg-white shadow-sm mb-4 ${tool.color}`}>
                        <tool.icon className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
                        {tool.title}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-xl mx-auto">
                        {tool.description}
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 max-w-4xl mx-auto">
                    {/* Pass the slug to Dropzone */}
                    <Dropzone toolSlug={slug} />
                </div>

            </div>
        </main>
    );
}