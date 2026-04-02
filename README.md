# ConvertIO

A modern, infinitely scalable, client-side PDF utility and Image resizer application.

ConvertIO shifts complex file processing entirely away from the server directly into the user's browser, enabling zero-cost scaling and rapid performance.

## 🚀 Features

- **Split PDF**: Extract specific pages (e.g., 1-5, 8).
- **Merge PDF**: Combine multiple documents quickly.
- **Rotate PDF**: Permanently rotate documents 90°, 180°, or 270°.
- **Protect PDF**: Securely encrypt PDFs with robust 128-bit RC4 encryption (`@pdfsmaller/pdf-encrypt-lite`).
- **Watermark PDF**: Stamp custom text overlays diagonally onto documents.
- **Add Page Numbers**: Automatically sequence bottom-footer pages.
- **Remove Pages**: Easily delete specified pages from a file.
- **Resize PDF (Dimensions)**: Rescale physical paper dimensions while maintaining aspect ratios automatically (A4, Letter).
- **Image to PDF**: Select multiple images and easily stitch them together inside a single generated PDF.
- **Resize Image**: Complete pixel / percentage scaler mapped precisely into a complex UI configuration.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (Turbopack) & React
- **Architecture**: Pure Client-Side (Zero API Bandwidth)
- **PDF Core**: `pdf-lib`, `jspdf`
- **Security**: `@pdfsmaller/pdf-encrypt-lite`
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 📦 Getting Started

First, install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔒 Security & Privacy Features

Because the `ConvertIO` engine is decoupled entirely from API Routes, your files are never uploaded to our servers or processed against memory buffers. 
All complex ArrayBuffer parsing happens natively in your browser utilizing HTML5 standard libraries. This ensures complete privacy.
