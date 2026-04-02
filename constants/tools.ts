import { 
  Files, 
  FileInput, 
  Image as ImageIcon, 
  Settings, 
  RefreshCw,
  Droplet,
  Hash,
  Trash2,
  Maximize,
  FileEdit
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
  },
  {
    slug: "watermark-pdf",
    title: "Watermark PDF",
    description: "Stamp a custom text watermark across your PDF pages.",
    icon: Droplet,
    color: "text-blue-400",
    acceptedTypes: ".pdf"
  },
  {
    slug: "page-numbers-pdf",
    title: "Add Page Numbers",
    description: "Insert page numbers at the bottom of your PDF document.",
    icon: Hash,
    color: "text-indigo-600",
    acceptedTypes: ".pdf"
  },
  {
    slug: "remove-pages-pdf",
    title: "Remove Pages",
    description: "Delete specific pages from your PDF file.",
    icon: Trash2,
    color: "text-red-600",
    acceptedTypes: ".pdf"
  },
  {
    slug: "resize-pdf",
    title: "Resize PDF (Dimensions)",
    description: "Change the physical paper size (A4, Letter) of your PDF.",
    icon: FileEdit,
    color: "text-emerald-600",
    acceptedTypes: ".pdf"
  },
  {
    slug: "resize-image",
    title: "Resize Image",
    description: "Change the pixel width and height boundaries of an image.",
    icon: Maximize,
    color: "text-cyan-600",
    acceptedTypes: "image/*"
  }
];