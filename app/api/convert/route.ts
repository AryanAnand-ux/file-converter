import { NextRequest, NextResponse } from "next/server";
// <--- FIX: All imports combined in one line here
import { PDFDocument, degrees, StandardFonts } from "pdf-lib"; 

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const slug = formData.get("slug") as string;
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // --- 1. MERGE PDF ---
    if (slug === 'merge-pdf') {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      return new NextResponse(pdfBytes, {
        status: 200,
        headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="merged.pdf"' },
      });
    }

    // --- 2. SPLIT PDF ---
    if (slug === 'split-pdf') {
        const pageRange = formData.get("pageRange") as string; 
        const fileBuffer = await files[0].arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBuffer);
        const newPdf = await PDFDocument.create();

        // Parse "1, 3" -> [0, 2]
        const pagesToExtract = pageRange
            .split(',')
            .map(num => parseInt(num.trim()) - 1)
            .filter(index => index >= 0 && index < pdfDoc.getPageCount());

        if (pagesToExtract.length === 0) {
            return NextResponse.json({ error: "Invalid page numbers" }, { status: 400 });
        }

        const copiedPages = await newPdf.copyPages(pdfDoc, pagesToExtract);
        copiedPages.forEach((page) => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();
        return new NextResponse(pdfBytes, { 
            status: 200, 
            headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="extracted.pdf"' } 
        });
    }

    // --- 3. ROTATE PDF ---
    if (slug === 'rotate-pdf') {
        const rotationStr = formData.get("rotation") as string;
        const rotationAngle = parseInt(rotationStr) || 90;
        const fileBuffer = await files[0].arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBuffer);
        
        const pages = pdfDoc.getPages();
        pages.forEach((page) => {
            const currentRotation = page.getRotation().angle;
            page.setRotation(degrees(currentRotation + rotationAngle));
        });

        const pdfBytes = await pdfDoc.save();
        return new NextResponse(pdfBytes, { 
            status: 200, 
            headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="rotated.pdf"' } 
        });
    }

    // --- 4. PROTECT PDF (Encryption) ---
    if (slug === 'protect-pdf') {
        const password = formData.get("password") as string;
        if (!password) {
             return NextResponse.json({ error: "Password is required" }, { status: 400 });
        }

        const fileBuffer = await files[0].arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBuffer);
        
        // Encrypt the file
        pdfDoc.encrypt({
            userPassword: password,
            ownerPassword: password,
            permissions: {
                printing: 'highResolution',
                modifying: false,
                copying: false
            }
        });

        const pdfBytes = await pdfDoc.save();
        return new NextResponse(pdfBytes, { 
            status: 200, 
            headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="protected.pdf"' } 
        });
    }

    return NextResponse.json({ error: "Tool not supported" }, { status: 400 });

  } catch (error) {
    console.error("Conversion Error:", error);
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}