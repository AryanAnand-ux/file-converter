"use client";

import { useState } from 'react';
import { Upload, File, X, Download, Loader2, RefreshCw, Lock, ArrowRight } from 'lucide-react';
import { jsPDF } from "jspdf";

interface DropzoneProps {
  toolSlug: string;
}

export default function Dropzone({ toolSlug }: DropzoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Tool-Specific States
  const [pageRange, setPageRange] = useState(""); 
  const [rotationAngle, setRotationAngle] = useState(90);
  const [password, setPassword] = useState("");

  const getAcceptedFormats = () => {
    switch (toolSlug) {
      case 'image-to-pdf': return { accept: 'image/*', label: 'JPG, PNG' };
      case 'merge-pdf':
      case 'split-pdf':
      case 'rotate-pdf':
      case 'protect-pdf': return { accept: '.pdf', label: 'PDF' };
      default: return { accept: '*', label: 'Files' };
    }
  };
  const config = getAcceptedFormats();

  // --- HELPER: GET BUTTON LABEL ---
  const getButtonLabel = () => {
    if (isConverting) return "Processing...";
    switch (toolSlug) {
      case 'merge-pdf': return 'Merge PDFs';
      case 'split-pdf': return 'Split PDF';
      case 'rotate-pdf': return 'Rotate PDF';
      case 'protect-pdf': return 'Protect PDF';
      case 'image-to-pdf': return 'Convert to PDF';
      default: return 'Convert File';
    }
  };

  // --- HANDLER: VALIDATE & ADD FILES ---
  const handleFiles = (newFiles: File[]) => {
    setError(null);
    setConvertedFileUrl(null);

    // 1. Check for Single-File Tools
    if ((toolSlug === 'split-pdf' || toolSlug === 'rotate-pdf' || toolSlug === 'protect-pdf') && (files.length > 0 || newFiles.length > 1)) {
        setError("For this tool, please upload only one PDF at a time.");
        return;
    }

    // 2. Filter Valid Files based on the Tool
    let validFiles: File[] = [];
    if (toolSlug === 'image-to-pdf') {
        validFiles = newFiles.filter(f => f.type.startsWith('image/'));
        if (validFiles.length !== newFiles.length) setError("Only image files (JPG, PNG) are allowed.");
    } 
    else if (toolSlug.includes('pdf')) {
        validFiles = newFiles.filter(f => f.type === 'application/pdf');
        if (validFiles.length !== newFiles.length) setError("Only PDF files are allowed.");
    } 
    else {
        validFiles = newFiles;
    }

    if (validFiles.length > 0) setFiles(prev => [...prev, ...validFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) handleFiles(Array.from(e.target.files));
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleFiles(Array.from(e.dataTransfer.files));
  };

  // --- CONVERSION LOGIC ---
  const handleConvert = async () => {
    if (files.length === 0) return;
    
    // Validation: Protect PDF requires password
    if (toolSlug === 'protect-pdf' && !password) {
        setError("Please enter a password.");
        return;
    }

    setIsConverting(true);
    setError(null);

    try {
      // 1. CLIENT-SIDE LOGIC (Images)
      if (toolSlug === 'image-to-pdf') {
        await convertImageToPdf(files[0]);
      } 
      // 2. SERVER-SIDE LOGIC (PDF Tools)
      else {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        formData.append("slug", toolSlug);

        if (toolSlug === 'split-pdf') formData.append("pageRange", pageRange);
        if (toolSlug === 'rotate-pdf') formData.append("rotation", rotationAngle.toString());
        if (toolSlug === 'protect-pdf') formData.append("password", password);

        const response = await fetch("/api/convert", { method: "POST", body: formData });
        
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Server failed");
        }
        
        const blob = await response.blob();
        setConvertedFileUrl(URL.createObjectURL(blob));
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Operation failed. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const convertImageToPdf = (imageFile: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imgData = event.target?.result as string;
          const img = new Image();
          img.src = imgData;
          img.onload = () => {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const widthRatio = pageWidth / img.width;
            const heightRatio = pageHeight / img.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
            const canvasWidth = img.width * ratio;
            const canvasHeight = img.height * ratio;
            const marginX = (pageWidth - canvasWidth) / 2;
            const marginY = (pageHeight - canvasHeight) / 2;

            pdf.addImage(imgData, 'JPEG', marginX, marginY, canvasWidth, canvasHeight);
            setConvertedFileUrl(URL.createObjectURL(pdf.output('blob')));
            resolve();
          };
        } catch (e) { reject(e); }
      };
      reader.readAsDataURL(imageFile);
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">{error}</div>}

      {/* UPLOAD AREA */}
      {(files.length === 0 || toolSlug === 'merge-pdf') && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 bg-white cursor-pointer"
        >
          <input type="file" multiple={toolSlug === 'merge-pdf'} accept={config.accept} className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileSelect} />
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-700 font-medium">Click or Drag to add {config.label}</p>
        </div>
      )}

      {/* FILE LIST & TOOLS */}
      {files.length > 0 && !convertedFileUrl && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           {files.map((f, i) => (
             <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded mb-4">
               <span className="truncate max-w-[200px] text-sm">{f.name}</span>
               <button onClick={() => setFiles([])}><X className="w-4 h-4 text-gray-400" /></button>
             </div>
           ))}

           {/* ROTATE UI */}
           {toolSlug === 'rotate-pdf' && (
             <div className="mb-6">
               <label className="block text-sm font-medium text-gray-700 mb-3">Rotation Angle</label>
               <div className="flex gap-4">
                 {[90, 180, 270].map((deg) => (
                   <button key={deg} onClick={() => setRotationAngle(deg)} className={`flex-1 py-2 px-4 rounded-lg border ${rotationAngle === deg ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200'}`}>
                     <div className="flex items-center justify-center gap-2">{deg}°</div>
                   </button>
                 ))}
               </div>
             </div>
           )}

           {/* SPLIT UI */}
           {toolSlug === 'split-pdf' && (
              <div className="mb-6">
                 <label className="text-sm font-medium">Pages (e.g. 1,3)</label>
                 <input type="text" value={pageRange} onChange={(e) => setPageRange(e.target.value)} className="w-full border p-2 rounded mt-1" placeholder="1, 3-5" />
              </div>
           )}

           {/* PROTECT UI */}
           {toolSlug === 'protect-pdf' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Set Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a strong password"
                      className="w-full border border-gray-300 rounded-lg p-2.5 pl-10 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
              </div>
           )}

           {/* ACTION BUTTON */}
           <button
             onClick={handleConvert}
             disabled={isConverting}
             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium flex justify-center items-center gap-2"
           >
             {isConverting ? <Loader2 className="animate-spin" /> : getButtonLabel()}
           </button>
        </div>
      )}

      {/* DOWNLOAD */}
      {convertedFileUrl && (
        <div className="bg-green-50 p-8 rounded-xl text-center">
          <Download className="w-12 h-12 text-green-600 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-green-800">Done!</h3>
          <a href={convertedFileUrl} download={`converted-${toolSlug}.pdf`} className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded-lg">Download File</a>
          <button onClick={() => { setFiles([]); setConvertedFileUrl(null); }} className="block mx-auto mt-4 text-sm text-gray-500">Start Over</button>
        </div>
      )}
    </div>
  );
}