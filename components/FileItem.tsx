import { X, File as FileIcon } from "lucide-react";

interface FileItemProps {
  file: File;
  onRemove: () => void;
}

export function FileItem({ file, onRemove }: FileItemProps) {
  // Utility to format byte size nicely
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="flex justify-between items-center bg-gray-50 border border-gray-100 p-3 rounded-lg mb-3 hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="p-2 bg-white rounded shadow-sm shrink-0">
          <FileIcon className="w-5 h-5 text-gray-500" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="truncate max-w-[200px] sm:max-w-[300px] text-sm font-medium text-gray-800">
            {file.name}
          </span>
          <span className="text-xs text-gray-500">{formatSize(file.size)}</span>
        </div>
      </div>
      <button 
        onClick={onRemove}
        className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors shrink-0"
        aria-label="Remove file"
      >
        <X className="w-4 h-4 text-gray-400 hover:text-red-600" />
      </button>
    </div>
  );
}
