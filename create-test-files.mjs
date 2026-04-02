import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';

async function createFiles() {
  // Create test.pdf with 3 pages to test split and rotate
  const pdfDoc = await PDFDocument.create();
  for(let i=1; i<=3; i++) {
    const page = pdfDoc.addPage();
    page.drawText(`Page ${i} - Test PDF for ConvertIO!`);
  }
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('test.pdf', pdfBytes);
  
  // Create test.png (1x1 transparent pixel)
  fs.writeFileSync('test.png', Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64'));
  
  console.log("Test files created: test.pdf, test.png");
}

createFiles().catch(console.error);
