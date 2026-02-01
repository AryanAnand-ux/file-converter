# 📄 File Converter - PDF & Image Utility

A modern, full-stack SaaS application for manipulating PDF files and converting images. Built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**.

🚀 **Live Demo:** [https://file-converter-opal.vercel.app/](https://file-converter-opal.vercel.app/)

![Project Screenshot](https://via.placeholder.com/1200x600?text=File+Converter+Dashboard+Screenshot)
*(You can replace this link with a real screenshot of your dashboard later)*

## ✨ Features

This application combines Client-Side (Browser) and Server-Side processing to ensure speed and privacy.

### 🛠️ PDF Tools (Server-Side)
Powered by `pdf-lib` for robust file handling.
* **Merge PDFs:** Combine multiple PDF documents into a single file.
* **Split PDF:** Extract specific pages (e.g., "1, 3-5") into a new document.
* **Rotate PDF:** Permanently rotate pages by 90°, 180°, or 270°.
* **Protect PDF:** Encrypt documents with secure password protection.

### 🖼️ Image Tools (Client-Side)
Powered by `jspdf`.
* **Image to PDF:** Convert JPG and PNG images to PDF instantly in the browser. Zero server upload required for maximum privacy.

---

## 💻 Tech Stack

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **PDF Engine:** [pdf-lib](https://github.com/Hopding/pdf-lib) (Backend)
* **Image Engine:** [jspdf](https://github.com/parallax/jsPDF) (Frontend)
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
    git clone [https://github.com/AryanAnand-ux/file-converter.git](https://github.com/AryanAnand-ux/file-converter.git)
    cd file-converter
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```
    > **Note:** This project relies on `pdf-lib` v1.17.1+ for encryption support. The `package.json` is configured to fetch the correct version.

3.  **Run the Development Server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Visit [http://localhost:3000](http://localhost:3000) to see the app running.

---

## ⚠️ Troubleshooting

If you encounter an error like `pdfDoc.encrypt is not a function`, it means an older version of the PDF library was installed.

**To fix this:**
1.  Delete `node_modules` and `package-lock.json`.
2.  Ensure `package.json` contains `"pdf-lib": "^1.17.1"`.
3.  Run `npm install` again.

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
