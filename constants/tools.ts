import { 
  Files, 
  FileInput, 
  Image as ImageIcon, 
  Settings, 
  RefreshCw 
} from 'lucide-react';

export const tools = [
  {
    slug: "image-to-pdf",
    title: "Image to PDF",
    description: "Convert JPG and PNG images to PDF securely in your browser.",
    icon: ImageIcon,
    color: "text-yellow-500",
    acceptedTypes: "image/*"
  },
  {
    slug: "merge-pdf",
    title: "Merge PDF",
    description: "Combine multiple PDFs into one unified document.",
    icon: Files,
    color: "text-red-500",
    acceptedTypes: ".pdf"
  },
  {
    slug: "split-pdf",
    title: "Split PDF",
    description: "Extract specific pages from a PDF document.",
    icon: FileInput,
    color: "text-blue-600",
    acceptedTypes: ".pdf"
  },
  {
    slug: "rotate-pdf",
    title: "Rotate PDF",
    description: "Rotate specific pages or the entire document permanently.",
    icon: RefreshCw,
    color: "text-purple-600",
    acceptedTypes: ".pdf"
  },
  {
    slug: "protect-pdf",
    title: "Protect PDF",
    description: "Encrypt your PDF with a secure password.",
    icon: Settings,
    color: "text-gray-700",
    acceptedTypes: ".pdf"
  }
];