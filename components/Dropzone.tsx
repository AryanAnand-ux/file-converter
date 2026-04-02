"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { usePdfConverter } from "../hooks/usePdfConverter";
import { UploadArea } from "./UploadArea";
import { ToolOptions } from "./ToolOptions";
import { FileItem } from "./FileItem";

interface DropzoneProps {
  toolSlug: string;
}

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
  
  // New Image Resize States
  const [imageUnit, setImageUnit] = useState("Percent");
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [resolutionDpi, setResolutionDpi] = useState("72");
  const [imageFormat, setImageFormat] = useState("JPG");
  const [imageQuality, setImageQuality] = useState("90");
  const [imageBackground, setImageBackground] = useState("#FFFFFF");

  // Local validation error
  const [validationError, setValidationError] = useState<string | null>(null);

  const { isConverting, error: convertError, convertedFileUrl, convertedFileSize, convert, reset } = usePdfConverter();

  const getAcceptedFormats = () => {
    switch (toolSlug) {
      case "image-to-pdf":
      case "resize-image":
        return { accept: "image/*", label: "JPG, PNG" };
      default:
        // All other tools expect PDFs
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
    reset();
  };

  const handleSubmit = async () => {
    setValidationError(null);

    if (toolSlug === "protect-pdf" && !password) {
      setValidationError("Please enter a password.");
      return;
    }
    
    if ((toolSlug === "split-pdf" || toolSlug === "remove-pages-pdf") && !pageRange) {
      setValidationError("Please enter the page ranges.");
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
      downloadExtension
    });
  };

  const displayError = validationError || convertError;
  const downloadExtension = toolSlug === "resize-image" ? imageFormat.toLowerCase() === "png" ? "png" : "jpg" : "pdf";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {displayError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 font-medium border border-red-100">
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Selected Files
            </h3>
            <div className="space-y-2">
              {files.map((f, i) => (
                <FileItem key={i} file={f} onRemove={() => handleRemoveFile(i)} />
              ))}
            </div>
          </div>

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

          {/* ACTION BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={isConverting || files.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-medium flex justify-center items-center gap-2 shadow-sm transition-all"
          >
            {isConverting ? <Loader2 className="animate-spin w-5 h-5" /> : getButtonLabel()}
          </button>
        </div>
      )}

      {/* DOWNLOAD SUCCESS STATE */}
      {convertedFileUrl && (
        <div className="bg-green-50 p-8 rounded-xl text-center border border-green-100 shadow-sm animate-in fade-in zoom-in duration-300">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-green-900 mb-2">Success!</h3>
          <p className="text-green-700 mb-8 max-w-sm mx-auto">
            Your file has been processed completely on your device. {convertedFileSize && <span className="font-bold underline ml-1">{convertedFileSize}</span>}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full mt-4">
            <a
              href={convertedFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-8 py-3 rounded-xl shadow-sm transition-colors text-lg text-center flex-1 sm:max-w-xs"
            >
              View File
            </a>
            <a
              href={convertedFileUrl}
              download={`converted-${toolSlug}.${downloadExtension}`}
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-xl shadow-sm transition-colors text-lg text-center flex-1 sm:max-w-xs"
            >
              Download File
            </a>
          </div>
          <button
            onClick={handleStartOver}
            className="block w-full max-w-xs mx-auto mt-6 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-transparent"
          >
            Process another file
          </button>
        </div>
      )}
    </div>
  );
}