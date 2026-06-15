import { X, File as FileIcon } from "lucide-react";

interface FileItemProps {
  file: File;
  onRemove: () => void;
}

export function FileItem({ file, onRemove }: FileItemProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="flex justify-between items-center bg-slate-50 border border-slate-100 p-3 rounded-xl hover:bg-slate-100/70 hover:shadow-sm hover:border-slate-200/60 transition-all duration-200">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="p-2 bg-white rounded-lg shadow-sm shrink-0 border border-slate-100 text-blue-500">
          <FileIcon className="w-4.5 h-4.5 text-blue-500" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="truncate max-w-[200px] sm:max-w-[320px] text-sm font-semibold text-slate-700">
            {file.name}
          </span>
          <span className="text-xs text-slate-400 font-medium">{formatSize(file.size)}</span>
        </div>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation(); // Avoid triggering any drag/drop actions
          onRemove();
        }}
        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors shrink-0 border border-transparent hover:border-red-100"
        aria-label="Remove file"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
