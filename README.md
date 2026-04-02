# 📄 File Converter - PDF & Image Utility

A modern, infinitely scalable, full-stack client-side PDF utility and Image resizer application.

Built with **Next.js 16 (Turbopack)**, **TypeScript**, and **Tailwind CSS**. ConvertIO shifts complex file processing entirely away from the server directly into the user's browser, enabling zero-cost scaling, ultimate privacy, and rapid performance.

🚀 **Live Demo:** [https://file-converter-opal.vercel.app/](https://file-converter-opal.vercel.app/)

## ✨ Features

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

## 🔒 Security & Privacy Features

Because the `ConvertIO` engine is decoupled entirely from API Routes, your files are never uploaded to our servers or processed against memory buffers. 
All complex ArrayBuffer parsing happens natively in your browser utilizing HTML5 standard libraries. This ensures complete privacy.

## 💻 Tech Stack

* **Framework:** [Next.js 16 (Turbopack)](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **PDF Core:** `pdf-lib`, `jspdf`
* **Security:** `@pdfsmaller/pdf-encrypt-lite`
* **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites
* Node.js installed (v18 or higher recommended)
* npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/AryanAnand-ux/file-converter.git
    cd file-converter
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run the Development Server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Visit [http://localhost:3000](http://localhost:3000) to see the app running.

---

## 🤝 Contributing

Contributions are welcome!
1.  Fork the project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Built with ❤️ by [Aryan Anand](https://github.com/AryanAnand-ux)*
