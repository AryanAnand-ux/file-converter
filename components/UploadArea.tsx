import { Upload } from "lucide-react";

interface UploadAreaProps {
  toolSlug: string;
  accept: string;
  label: string;
  onFilesSelected: (files: File[]) => void;
}

export function UploadArea({ toolSlug, accept, label, onFilesSelected }: UploadAreaProps) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 bg-white cursor-pointer transition-colors"
    >
      <input
        type="file"
        multiple={toolSlug === "merge-pdf"}
        accept={accept}
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={handleFileSelect}
      />
      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p className="text-gray-700 font-medium">Click or Drag to add {label}</p>
    </div>
  );
}
