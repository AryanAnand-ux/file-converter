"use client";

import { useState, useEffect, useRef } from "react";
import { Download, Loader2, GripVertical, Check } from "lucide-react";
import { usePdfConverter } from "../hooks/usePdfConverter";
import { UploadArea } from "./UploadArea";
import { ToolOptions } from "./ToolOptions";
import { FileItem } from "./FileItem";
import * as pdfjs from "pdfjs-dist";

// Configure worker safely for Next.js SSR
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs";
}

interface DropzoneProps {
  toolSlug: string;
}

interface PdfPage {
  pageIndex: number;
  selected: boolean;
  width: number;
  height: number;
}

// -------------------------------------------------------------
// Lazy Thumbnail Render Component (Using Intersection Observer)
// -------------------------------------------------------------
interface PdfPageThumbnailProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pdfDocument: any;
  pageIndex: number;
  rotationAngle: number;
}

function PdfPageThumbnail({ pdfDocument, pageIndex, rotationAngle }: PdfPageThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rendered, setRendered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !rendered && pdfDocument && active) {
          observer.disconnect();
          
          const renderThumbnail = async () => {
            try {
              const page = await pdfDocument.getPage(pageIndex + 1);
              if (!active) return;
              
              const canvas = canvasRef.current;
              if (!canvas) return;
              
              const context = canvas.getContext("2d");
              if (!context) return;
              
              // Scale down for preview thumbnail
              const viewport = page.getViewport({ scale: 0.22 });
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              
              await page.render({ canvasContext: context, viewport }).promise;
              if (active) {
                setRendered(true);
                setLoading(false);
              }
            } catch (err) {
              console.error("Error rendering page thumbnail:", err);
              if (active) setLoading(false);
            }
          };
          
          renderThumbnail();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      active = false;
      observer.disconnect();
    };
  }, [pdfDocument, pageIndex, rendered]);

  // Handle visual rotation angle transitions for visual rotater tool
  const isRotateTool = rotationAngle !== 0;

  return (
    <div 
      ref={containerRef} 
      className="relative w-full aspect-[3/4] bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm"
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        style={{ 
          transform: isRotateTool ? `rotate(${rotationAngle}deg)` : "none", 
          transition: "transform 0.3s ease" 
        }} 
        className="w-full h-full object-contain" 
      />
    </div>
  );
}

// -----------------------------
// Helper to Format Page Ranges
// -----------------------------
const getRangeStringFromIndices = (indices: number[]): string => {
  if (indices.length === 0) return "";
  indices.sort((a, b) => a - b);
  
  const parts = [];
  let start = indices[0];
  let prev = indices[0];
  
  for (let i = 1; i < indices.length; i++) {
    const current = indices[i];
    if (current === prev + 1) {
      prev = current;
    } else {
      if (start === prev) {
        parts.push(`${start}`);
      } else {
        parts.push(`${start}-${prev}`);
      }
      start = current;
      prev = current;
    }
  }
  
  if (start === prev) {
    parts.push(`${start}`);
  } else {
    parts.push(`${start}-${prev}`);
  }
  
  return parts.join(", ");
};

// -----------------------------
// Main Dropzone Component
// -----------------------------
export default function Dropzone({ toolSlug }: DropzoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  
  // Tool-Specific States
  const [pageRange, setPageRange] = useState("");
  const [rotationAngle, setRotationAngle] = useState(90);
  const [password, setPassword] = useState("");
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [imageWidth, setImageWidth] = useState("70");
  const [imageHeight, setImageHeight] = useState("70");
  const [pdfPageSize, setPdfPageSize] = useState("A4");
  
  // Image Resize States
  const [imageUnit, setImageUnit] = useState("Percent");
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [resolutionDpi, setResolutionDpi] = useState("72");
  const [imageFormat, setImageFormat] = useState("JPG");
  const [imageQuality, setImageQuality] = useState("90");
  const [imageBackground, setImageBackground] = useState("#FFFFFF");

  // Local PDF Previews & Reordering States
  const [pdfPages, setPdfPages] = useState<PdfPage[]>([]);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [pdfLoadError, setPdfLoadError] = useState<string | null>(null);
  const [isLoadingPreviews, setIsLoadingPreviews] = useState(false);

  // Drag and Drop States
  const [draggedPageIndex, setDraggedPageIndex] = useState<number | null>(null);
  const [draggedFileIndex, setDraggedFileIndex] = useState<number | null>(null);

  // Local validation error
  const [validationError, setValidationError] = useState<string | null>(null);

  const { isConverting, error: convertError, convertedFileUrl, convertedFileSize, convert, reset } = usePdfConverter();

  // Load PDF Document for client-side previews (when 1 PDF file is selected and it isn't a merge operation)
  useEffect(() => {
    if (files.length === 1 && files[0].type === "application/pdf" && toolSlug !== "merge-pdf") {
      const file = files[0];
      let active = true;
      
      const loadPdf = async () => {
        setIsLoadingPreviews(true);
        setPdfLoadError(null);
        setPdfPages([]);
        setPageOrder([]);
        setPdfDocument(null);
        
        try {
          const arrayBuffer = await file.arrayBuffer();
          const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
          
          loadingTask.onPassword = (updatePassword: (pw: string) => void) => {
            if (active) {
              setPdfLoadError("This PDF is password-protected. Page previews are locked.");
              setIsLoadingPreviews(false);
            }
            updatePassword(""); // Abort rendering previews
          };

          const pdf = await loadingTask.promise;
          if (!active) return;
          
          setPdfDocument(pdf);
          const count = pdf.numPages;
          const initialPages: PdfPage[] = [];
          const initialOrder: number[] = [];
          
          // Max page previews capped at 100 to prevent tab crashes
          const previewCount = Math.min(count, 100);
          for (let i = 1; i <= previewCount; i++) {
            initialPages.push({
              pageIndex: i - 1,
              selected: true,
              width: 150,
              height: 200,
            });
            initialOrder.push(i - 1);
          }
          
          setPdfPages(initialPages);
          setPageOrder(initialOrder);
        } catch (err: unknown) {
          console.error("PDF loading error:", err);
          if (active) {
            const errName = err instanceof Error ? err.name : (err && typeof err === "object" && "name" in err ? String((err as Record<string, unknown>).name) : "");
            if (errName === "PasswordException") {
              setPdfLoadError("Password-protected PDF. Previews are unavailable, but you can still process it by entering the password below.");
            } else {
              setPdfLoadError("Could not load PDF previews.");
            }
          }
        } finally {
          if (active) {
            setIsLoadingPreviews(false);
          }
        }
      };
      
      loadPdf();
      
      return () => {
        active = false;
      };
    } else {
      setPdfPages([]);
      setPageOrder([]);
      setPdfDocument(null);
      setPdfLoadError(null);
    }
  }, [files, toolSlug]);

  const getAcceptedFormats = () => {
    switch (toolSlug) {
      case "image-to-pdf":
      case "resize-image":
        return { accept: "image/*", label: "JPG, PNG" };
      default:
        return { accept: ".pdf", label: "PDF" };
    }
  };
  const config = getAcceptedFormats();

  const getButtonLabel = () => {
    if (isConverting) return "Processing on your device...";
    switch (toolSlug) {
      case "merge-pdf": return "Merge PDFs";
      case "split-pdf": return "Extract Pages";
      case "rotate-pdf": return "Rotate PDF";
      case "protect-pdf": return "Protect PDF";
      case "unprotect-pdf": return "Unlock PDF";
      case "image-to-pdf": return "Convert to PDF";
      case "watermark-pdf": return "Add Watermark";
      case "page-numbers-pdf": return "Add Page Numbers";
      case "remove-pages-pdf": return "Remove Pages";
      case "resize-pdf": return "Resize PDF";
      case "resize-image": return "Resize Image";
      default: return "Process File";
    }
  };

  const handleFilesSelected = (newFiles: File[]) => {
    setValidationError(null);

    // Enforce single file tool limits
    const isSingleFileTool = toolSlug !== "merge-pdf" && toolSlug !== "image-to-pdf";
    
    if (isSingleFileTool && (files.length > 0 || newFiles.length > 1)) {
      setValidationError("For this tool, please select only one file at a time.");
      return;
    }

    // Dynamic file size validation
    const maxImageSize = 25 * 1024 * 1024; // 25MB
    const maxPdfSize = 100 * 1024 * 1024; // 100MB
    const maxMergeSize = 150 * 1024 * 1024; // 150MB

    if (toolSlug === "image-to-pdf" || toolSlug === "resize-image") {
      for (const f of newFiles) {
        if (f.size > maxImageSize) {
          setValidationError(`Each image must be under 25MB. "${f.name}" exceeds this limit.`);
          return;
        }
      }
    } else if (toolSlug === "merge-pdf") {
      const currentTotal = files.reduce((sum, f) => sum + f.size, 0);
      const incomingTotal = newFiles.reduce((sum, f) => sum + f.size, 0);
      if (currentTotal + incomingTotal > maxMergeSize) {
        setValidationError(`Combined PDF size exceeds the 150MB limit.`);
        return;
      }
    } else {
      for (const f of newFiles) {
        if (f.size > maxPdfSize) {
          setValidationError(`PDF files must be under 100MB. "${f.name}" exceeds this limit.`);
          return;
        }
      }
    }

    let validFiles: File[] = [];
    if (config.accept === "image/*") {
      validFiles = newFiles.filter((f) => f.type.startsWith("image/"));
      if (validFiles.length !== newFiles.length) {
        setValidationError("Only image files (JPG, PNG) are allowed.");
      }
    } else {
      validFiles = newFiles.filter((f) => f.type === "application/pdf");
      if (validFiles.length !== newFiles.length) {
        setValidationError("Only PDF files are allowed.");
      }
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setValidationError(null);
  };

  // Drag and drop sorting for file queues (Merge PDF / Image to PDF)
  const handleFileDragStart = (index: number) => {
    if (isConverting) return;
    setDraggedFileIndex(index);
  };

  const handleFileDrop = (targetIndex: number) => {
    if (draggedFileIndex === null || draggedFileIndex === targetIndex || isConverting) return;
    setFiles((prev) => {
      const nextFiles = [...prev];
      const [draggedFile] = nextFiles.splice(draggedFileIndex, 1);
      nextFiles.splice(targetIndex, 0, draggedFile);
      return nextFiles;
    });
    setDraggedFileIndex(null);
  };

  // HTML5 Drag and drop sorting for PDF pages preview grid
  const handlePageDragStart = (index: number) => {
    if (isConverting) return;
    setDraggedPageIndex(index);
  };

  const handlePageDrop = (targetPageIndex: number) => {
    if (draggedPageIndex === null || draggedPageIndex === targetPageIndex || isConverting) return;
    
    setPageOrder((prev) => {
      const nextOrder = [...prev];
      const draggedPos = nextOrder.indexOf(draggedPageIndex);
      const targetPos = nextOrder.indexOf(targetPageIndex);
      
      if (draggedPos !== -1 && targetPos !== -1) {
        nextOrder.splice(draggedPos, 1);
        nextOrder.splice(targetPos, 0, draggedPageIndex);
      }
      return nextOrder;
    });
    setDraggedPageIndex(null);
  };

  // Toggle page selection in visual page previews (Split PDF & Remove Pages)
  const handleTogglePageSelection = (index: number) => {
    if (isConverting) return;
    
    setPdfPages((prev) => {
      const updated = prev.map((p) =>
        p.pageIndex === index ? { ...p, selected: !p.selected } : p
      );
      
      // Auto-update page range text box
      const selectedPages = updated
        .filter((p) => p.selected)
        .map((p) => p.pageIndex + 1);
      
      const rangeStr = getRangeStringFromIndices(selectedPages);
      setPageRange(rangeStr);
      
      return updated;
    });
  };

  const handleStartOver = () => {
    setFiles([]);
    setPageRange("");
    setPassword("");
    setRotationAngle(90);
    setWatermarkText("CONFIDENTIAL");
    setImageWidth("70");
    setImageHeight("70");
    setImageUnit("Percent");
    setMaintainAspectRatio(true);
    setResolutionDpi("72");
    setImageFormat("JPG");
    setImageQuality("90");
    setImageBackground("#FFFFFF");
    setPdfPageSize("A4");
    setValidationError(null);
    setPdfPages([]);
    setPageOrder([]);
    setPdfDocument(null);
    setPdfLoadError(null);
    reset();
  };

  const handleSubmit = async () => {
    setValidationError(null);

    if (toolSlug === "protect-pdf" && !password) {
      setValidationError("Please enter a password.");
      return;
    }

    if (toolSlug === "unprotect-pdf" && !password) {
      setValidationError("Please enter the PDF password to unlock.");
      return;
    }
    
    if ((toolSlug === "split-pdf" || toolSlug === "remove-pages-pdf") && !pageRange) {
      setValidationError("Please enter or select the page ranges.");
      return;
    }

    let downloadExtension = "pdf";
    if (toolSlug === "resize-image") {
      downloadExtension = imageFormat.toLowerCase() === "png" ? "png" : "jpg";
    }

    await convert({
      toolSlug,
      files,
      pageRange,
      password,
      rotationAngle,
      watermarkText,
      imageWidth,
      imageHeight,
      imageUnit,
      maintainAspectRatio,
      resolutionDpi,
      imageFormat,
      imageQuality,
      imageBackground,
      pdfPageSize,
      downloadExtension,
      pageOrder, // Pass reordered indices list
    });
  };

  const displayError = validationError || convertError;
  const downloadExtension = toolSlug === "resize-image" ? imageFormat.toLowerCase() === "png" ? "png" : "jpg" : "pdf";

  // Preserve original filename on output
  const getDownloadFilename = () => {
    if (files.length === 0) return `converted-${toolSlug}.${downloadExtension}`;
    const primaryFile = files[0];
    const dotIndex = primaryFile.name.lastIndexOf(".");
    const baseName = dotIndex !== -1 ? primaryFile.name.substring(0, dotIndex) : primaryFile.name;
    
    let suffix = "processed";
    switch (toolSlug) {
      case "merge-pdf": suffix = "merged"; break;
      case "split-pdf": suffix = "split"; break;
      case "rotate-pdf": suffix = "rotated"; break;
      case "protect-pdf": suffix = "protected"; break;
      case "unprotect-pdf": suffix = "unlocked"; break;
      case "watermark-pdf": suffix = "watermarked"; break;
      case "page-numbers-pdf": suffix = "numbered"; break;
      case "remove-pages-pdf": suffix = "edited"; break;
      case "resize-pdf": suffix = "resized"; break;
      case "resize-image": suffix = "resized"; break;
      case "image-to-pdf": suffix = "converted"; break;
    }
    return `${baseName}_${suffix}.${downloadExtension}`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {displayError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 font-medium border border-red-100 transition-all shadow-sm">
          {displayError}
        </div>
      )}

      {/* UPLOAD AREA */}
      {(files.length === 0 || toolSlug === "merge-pdf" || toolSlug === "image-to-pdf") && !convertedFileUrl && (
        <UploadArea
          toolSlug={toolSlug}
          accept={config.accept}
          label={config.label}
          onFilesSelected={handleFilesSelected}
        />
      )}

      {/* FILE QUEUE & TOOLS */}
      {files.length > 0 && !convertedFileUrl && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 transition-all">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Selected Files {(toolSlug === "merge-pdf" || toolSlug === "image-to-pdf") && files.length > 1 && (
                  <span className="text-blue-500 lowercase normal-case font-normal ml-1">
                    (drag items to reorder)
                  </span>
                )}
              </h3>
              <span className="text-xs text-gray-500 font-medium">
                {files.length} file{files.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {files.map((f, i) => (
                <div
                  key={i}
                  draggable={!isConverting && (toolSlug === "merge-pdf" || toolSlug === "image-to-pdf")}
                  onDragStart={() => handleFileDragStart(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleFileDrop(i)}
                  className={`transition-all ${
                    !isConverting && (toolSlug === "merge-pdf" || toolSlug === "image-to-pdf")
                      ? "cursor-grab active:cursor-grabbing hover:bg-slate-50"
                      : ""
                  }`}
                >
                  <FileItem file={f} onRemove={() => handleRemoveFile(i)} />
                </div>
              ))}
            </div>
          </div>

          {/* VISUAL PAGE PREVIEWS & DRAG REORDER GRID */}
          {pdfPages.length > 0 && (
            <div className="mb-6 border-t border-slate-100 pt-6">
              <div className="flex flex-col gap-1 mb-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  PDF Page Grid
                  {pdfPages.length > 1 && (
                    <span className="text-blue-500 font-normal lowercase normal-case">
                      (drag to reorder pages {toolSlug === "split-pdf" || toolSlug === "remove-pages-pdf" ? "or click to select" : ""})
                    </span>
                  )}
                </h3>
                {pdfLoadError && (
                  <p className="text-xs text-amber-600 font-medium">{pdfLoadError}</p>
                )}
              </div>

              {isLoadingPreviews ? (
                <div className="flex flex-col items-center justify-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                  <p className="text-sm font-medium text-slate-500">Loading page thumbnails...</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  {pageOrder.map((pageIdx) => {
                    const page = pdfPages.find((p) => p.pageIndex === pageIdx);
                    if (!page) return null;
                    
                    const isSelected = page.selected;
                    const supportsSelection = toolSlug === "split-pdf" || toolSlug === "remove-pages-pdf";

                    return (
                      <div
                        key={pageIdx}
                        draggable={!isConverting}
                        onDragStart={() => handlePageDragStart(pageIdx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handlePageDrop(pageIdx)}
                        onClick={() => supportsSelection && handleTogglePageSelection(pageIdx)}
                        className={`group relative flex flex-col items-center p-2 rounded-lg border-2 bg-white transition-all select-none cursor-pointer ${
                          !isConverting ? "cursor-grab active:cursor-grabbing" : ""
                        } ${
                          supportsSelection 
                            ? isSelected 
                              ? "border-blue-500 ring-2 ring-blue-500/20" 
                              : "border-slate-200 hover:border-slate-300"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="absolute top-2.5 right-2.5 z-20 flex gap-1 items-center">
                          {/* Reorder drag handle indicator */}
                          <div className="p-0.5 bg-white/90 backdrop-blur rounded border border-slate-200 text-slate-400 group-hover:text-slate-600 transition-colors shadow-sm">
                            <GripVertical size={12} />
                          </div>
                        </div>

                        {/* Visual Thumbnail */}
                        <PdfPageThumbnail
                          pdfDocument={pdfDocument}
                          pageIndex={pageIdx}
                          rotationAngle={toolSlug === "rotate-pdf" ? rotationAngle : 0}
                        />

                        {/* Page Number Label */}
                        <div className="mt-2 w-full flex items-center justify-between px-1">
                          <span className="text-xs font-semibold text-slate-500">
                            Page {pageIdx + 1}
                          </span>
                          {supportsSelection && isSelected && (
                            <span className="p-0.5 bg-blue-500 text-white rounded-full">
                              <Check size={8} />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* DYNAMIC PARAMETER CONFIG OPTIONS */}
          <ToolOptions
            toolSlug={toolSlug}
            pageRange={pageRange}
            setPageRange={setPageRange}
            rotationAngle={rotationAngle}
            setRotationAngle={setRotationAngle}
            password={password}
            setPassword={setPassword}
            watermarkText={watermarkText}
            setWatermarkText={setWatermarkText}
            imageWidth={imageWidth}
            setImageWidth={setImageWidth}
            imageHeight={imageHeight}
            setImageHeight={setImageHeight}
            pdfPageSize={pdfPageSize}
            setPdfPageSize={setPdfPageSize}
            isConverting={isConverting}
            imageUnit={imageUnit}
            setImageUnit={setImageUnit}
            maintainAspectRatio={maintainAspectRatio}
            setMaintainAspectRatio={setMaintainAspectRatio}
            resolutionDpi={resolutionDpi}
            setResolutionDpi={setResolutionDpi}
            imageFormat={imageFormat}
            setImageFormat={setImageFormat}
            imageQuality={imageQuality}
            setImageQuality={setImageQuality}
            imageBackground={imageBackground}
            setImageBackground={setImageBackground}
          />

          {/* ACTION SUBMIT BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={isConverting || files.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold flex justify-center items-center gap-2 shadow-sm transition-all"
          >
            {isConverting ? <Loader2 className="animate-spin w-5 h-5" /> : getButtonLabel()}
          </button>
        </div>
      )}

      {/* DOWNLOAD SUCCESS STATE */}
      {convertedFileUrl && (
        <div className="bg-green-50 p-8 rounded-2xl text-center border border-green-100 shadow-sm animate-in fade-in zoom-in duration-300">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-green-950 mb-2">Success!</h3>
          <p className="text-green-700 mb-8 max-w-sm mx-auto">
            Your file has been processed completely on your device. {convertedFileSize && <span className="font-bold underline ml-1">{convertedFileSize}</span>}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full mt-4">
            <a
              href={convertedFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-8 py-3 rounded-xl shadow-sm transition-colors text-lg text-center flex-1 sm:max-w-xs"
            >
              View File
            </a>
            <a
              href={convertedFileUrl}
              download={getDownloadFilename()}
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl shadow-sm transition-colors text-lg text-center flex-1 sm:max-w-xs"
            >
              Download File
            </a>
          </div>
          <button
            onClick={handleStartOver}
            className="block w-full max-w-xs mx-auto mt-6 px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-colors border border-transparent"
          >
            Process another file
          </button>
        </div>
      )}
    </div>
  );
}