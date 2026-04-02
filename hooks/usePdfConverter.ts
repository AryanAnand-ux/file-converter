"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import { PDFDocument, degrees, rgb, StandardFonts, PageSizes } from "pdf-lib";
import { encryptPDF } from "@pdfsmaller/pdf-encrypt-lite";

interface ConvertOptions {
  toolSlug: string;
  files: File[];
  pageRange?: string;
  rotationAngle?: number;
  password?: string;
  watermarkText?: string;
  imageWidth?: string;
  imageHeight?: string;
  pdfPageSize?: string;
  downloadExtension?: string;
  imageUnit?: string;
  maintainAspectRatio?: boolean;
  resolutionDpi?: string;
  imageFormat?: string;
  imageQuality?: string;
  imageBackground?: string;
}

export function usePdfConverter() {
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
  const [convertedFileSize, setConvertedFileSize] = useState<string | null>(null);

  const handleBlobCreated = (blob: Blob) => {
    setConvertedFileUrl(URL.createObjectURL(blob));
    const kb = blob.size / 1024;
    if (kb > 1024) {
      setConvertedFileSize((kb / 1024).toFixed(2) + " MB");
    } else {
      setConvertedFileSize(kb.toFixed(2) + " KB");
    }
  };

  const convert = async (options: ConvertOptions) => {
    const { toolSlug, files } = options;
    if (files.length === 0) return;
    
    setIsConverting(true);
    setError(null);

    try {
      if (toolSlug === "image-to-pdf") {
        await convertImageToPdf(files);
      } else if (toolSlug === "resize-image") {
        await resizeImage(options);
      } else {
        await convertPdf(options);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Operation failed. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const convertImageToPdf = async (imageFiles: File[]) => {
    const pdf = new jsPDF("p", "mm", "a4");

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      await new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imgData = event.target?.result as string;
            const img = new Image();
            img.src = imgData;
            img.onload = () => {
              const pageWidth = pdf.internal.pageSize.getWidth();
              const pageHeight = pdf.internal.pageSize.getHeight();
              const widthRatio = pageWidth / img.width;
              const heightRatio = pageHeight / img.height;
              const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
              const canvasWidth = img.width * ratio;
              const canvasHeight = img.height * ratio;
              const marginX = (pageWidth - canvasWidth) / 2;
              const marginY = (pageHeight - canvasHeight) / 2;

              if (i > 0) pdf.addPage();
              pdf.addImage(imgData, "JPEG", marginX, marginY, canvasWidth, canvasHeight);
              resolve();
            };
            img.onerror = () => reject(new Error("Invalid image mapping"));
          } catch (e) {
            reject(e);
          }
        };
        reader.onerror = () => reject(new Error("Failed to read image file"));
        reader.readAsDataURL(file);
      });
    }

    const arrayBuffer = pdf.output("arraybuffer");
    handleBlobCreated(new Blob([new Uint8Array(arrayBuffer)], { type: "application/pdf" }));
  };

  const resizeImage = (options: ConvertOptions) => {
    const { files, imageWidth, imageHeight, imageUnit, maintainAspectRatio, resolutionDpi, imageFormat, imageQuality, imageBackground } = options;
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          let finalWidth = img.width;
          let finalHeight = img.height;

          const wVal = parseFloat(imageWidth || "0");
          const hVal = parseFloat(imageHeight || "0");
          const dpi = parseFloat(resolutionDpi || "72");

          let pW = img.width;
          let pH = img.height;

          if (imageUnit === "Percent") {
            pW = (wVal > 0 ? (wVal / 100) * img.width : img.width);
            pH = (hVal > 0 ? (hVal / 100) * img.height : img.height);
          } else if (imageUnit === "Pixels") {
            pW = wVal > 0 ? wVal : img.width;
            pH = hVal > 0 ? hVal : img.height;
          } else if (imageUnit === "Inches") {
            pW = wVal > 0 ? wVal * dpi : img.width;
            pH = hVal > 0 ? hVal * dpi : img.height;
          } else if (imageUnit === "Centimeters") {
            pW = wVal > 0 ? (wVal / 2.54) * dpi : img.width;
            pH = hVal > 0 ? (hVal / 2.54) * dpi : img.height;
          }

          if (maintainAspectRatio && (wVal > 0 || hVal > 0)) {
            if (wVal > 0) {
              finalWidth = pW;
              finalHeight = (img.height / img.width) * pW;
            } else {
              finalHeight = pH;
              finalWidth = (img.width / img.height) * pH;
            }
          } else {
            finalWidth = wVal > 0 ? pW : img.width;
            finalHeight = hVal > 0 ? pH : img.height;
          }

          finalWidth = Math.max(1, Math.round(finalWidth));
          finalHeight = Math.max(1, Math.round(finalHeight));

          const canvas = document.createElement("canvas");
          canvas.width = finalWidth;
          canvas.height = finalHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("Failed to get canvas context");
          
          if (imageBackground) {
            ctx.fillStyle = imageBackground;
            ctx.fillRect(0, 0, finalWidth, finalHeight);
          }
          
          ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
          
          let outType = "image/jpeg";
          if (imageFormat === "PNG") outType = "image/png";
          if (imageFormat === "WEBP") outType = "image/webp";

          const exactQuality = Math.min(100, Math.max(1, parseFloat(imageQuality || "90"))) / 100;

          canvas.toBlob((blob) => {
            if (blob) {
              handleBlobCreated(blob);
              resolve();
            } else {
              reject(new Error("Failed to create blob from canvas"));
            }
          }, outType, exactQuality);
        };
        img.onerror = () => reject(new Error("Invalid image"));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.readAsDataURL(files[0]);
    });
  };

  const convertPdf = async (options: ConvertOptions) => {
    const { toolSlug, files, pageRange, rotationAngle, password, watermarkText, pdfPageSize } = options;

    if (toolSlug === "protect-pdf") {
      if (!password) throw new Error("Password is required.");
      const fileBuffer = await files[0].arrayBuffer();
      const encryptedBytes = await encryptPDF(new Uint8Array(fileBuffer), password, password);
      handleBlobCreated(new Blob([new Uint8Array(encryptedBytes)], { type: "application/pdf" }));
      return;
    }

    if (toolSlug === "merge-pdf") {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        try {
          const pdf = await PDFDocument.load(fileBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } catch (e) {
          throw new Error(`Failed to load file ${file.name}. It might be encrypted or invalid.`);
        }
      }
      const pdfBytes = await mergedPdf.save();
      handleBlobCreated(new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }));
      return;
    }

    // For single file tools
    const fileBuffer = await files[0].arrayBuffer();
    let pdfDoc: PDFDocument;
    try {
      pdfDoc = await PDFDocument.load(fileBuffer);
    } catch (e) {
      throw new Error(`Failed to load PDF. It might be already encrypted or corrupted.`);
    }

    if (toolSlug === "split-pdf") {
      if (!pageRange) throw new Error("Page range is required.");
      const newPdf = await PDFDocument.create();
      const pagesToExtract = parsePageRange(pageRange, pdfDoc.getPageCount());
      
      if (pagesToExtract.length === 0) {
        throw new Error("Invalid page numbers or range.");
      }

      const copiedPages = await newPdf.copyPages(pdfDoc, pagesToExtract);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      handleBlobCreated(new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }));
      return;
    }

    if (toolSlug === "remove-pages-pdf") {
      if (!pageRange) throw new Error("Page range is required.");
      const pagesToRemove = parsePageRange(pageRange, pdfDoc.getPageCount());
      if (pagesToRemove.length === 0) throw new Error("Invalid page numbers.");
      
      // Remove backwards so indices don't shift
      pagesToRemove.reverse().forEach((index) => {
        pdfDoc.removePage(index);
      });

      const pdfBytes = await pdfDoc.save();
      handleBlobCreated(new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }));
      return;
    }

    if (toolSlug === "rotate-pdf") {
      const angle = rotationAngle || 90;
      const pages = pdfDoc.getPages();
      pages.forEach((page) => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + angle));
      });

      const pdfBytes = await pdfDoc.save();
      handleBlobCreated(new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }));
      return;
    }

    if (toolSlug === "watermark-pdf") {
      const text = watermarkText || "CONFIDENTIAL";
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const fontSize = 60;
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        page.drawText(text, {
          x: width / 2 - textWidth / 2,
          y: height / 2 - textHeight / 2,
          size: fontSize,
          font: font,
          color: rgb(0.5, 0.5, 0.5),
          opacity: 0.3,
          rotate: degrees(45),
        });
      });

      const pdfBytes = await pdfDoc.save();
      handleBlobCreated(new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }));
      return;
    }

    if (toolSlug === "page-numbers-pdf") {
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      pages.forEach((page, idx) => {
        const { width } = page.getSize();
        const text = `Page ${idx + 1} of ${pages.length}`;
        const fontSize = 12;
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        
        page.drawText(text, {
          x: width / 2 - textWidth / 2,
          y: 20,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0),
        });
      });

      const pdfBytes = await pdfDoc.save();
      handleBlobCreated(new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }));
      return;
    }

    if (toolSlug === "resize-pdf") {
      const sizeParam = pdfPageSize || "A4";
      let targetSize = PageSizes.A4;
      if (sizeParam === "Letter") targetSize = PageSizes.Letter;

      const newPdf = await PDFDocument.create();
      const pages = pdfDoc.getPages();

      for (let i = 0; i < pages.length; i++) {
        // Embed the page directly
        const [embeddedPage] = await newPdf.embedPdf(await pdfDoc.save(), [i]);
        
        const newPage = newPdf.addPage(targetSize);
        const embeddedDims = embeddedPage.scale(1);
        
        // Calculate scaling to Fit into new bounds (maintaining aspect ratio)
        let scale = 1;
        if (sizeParam !== "Fit") {
          const scaleX = targetSize[0] / embeddedDims.width;
          const scaleY = targetSize[1] / embeddedDims.height;
          scale = Math.min(scaleX, scaleY);
        }

        const scaledWidth = embeddedDims.width * scale;
        const scaledHeight = embeddedDims.height * scale;

        newPage.drawPage(embeddedPage, {
          x: targetSize[0] / 2 - scaledWidth / 2,
          y: targetSize[1] / 2 - scaledHeight / 2,
          width: scaledWidth,
          height: scaledHeight,
        });
      }

      const pdfBytes = await newPdf.save();
      handleBlobCreated(new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }));
      return;
    }
    
    throw new Error("Unknown tool action");
  };

  const parsePageRange = (rangeStr: string, totalPages: number): number[] => {
    const pages = new Set<number>();
    const parts = rangeStr.split(",");
    
    for (let part of parts) {
      part = part.trim();
      if (!part) continue;
      
      if (part.includes("-")) {
        const bounds = part.split("-").map(p => parseInt(p.trim()));
        if (bounds.length === 2 && !isNaN(bounds[0]) && !isNaN(bounds[1])) {
          let start = bounds[0];
          let end = bounds[1];
          // Ensure valid direction
          if (start > end) {
            const temp = start;
            start = end;
            end = temp;
          }
          for (let i = start; i <= end; i++) {
            if (i > 0 && i <= totalPages) {
              pages.add(i - 1);
            }
          }
        }
      } else {
        const pageNum = parseInt(part);
        if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
          pages.add(pageNum - 1);
        }
      }
    }
    
    return Array.from(pages).sort((a, b) => a - b);
  };

  const reset = () => {
    setConvertedFileUrl(null);
    setConvertedFileSize(null);
    setError(null);
  };

  return { isConverting, error, convertedFileUrl, convertedFileSize, convert, reset };
}
