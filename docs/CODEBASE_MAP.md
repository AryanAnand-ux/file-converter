# Codebase Map

This document lists the files and folders inside the project and their responsibilities:

- `/app`: Contains layout and pages.
  - `/app/page.tsx`: Home grid page displaying all tools.
  - `/app/tools/[slug]/page.tsx`: Dynamic tool viewer.
- `/components`:
  - `Dropzone.tsx`: Main orchestrator handling state, rendering thumbnails, drag-and-drop, and downloads.
  - `ToolOptions.tsx`: Renders specific inputs dynamically for each tool.
  - `UploadArea.tsx`: Dropzone file upload box.
  - `FileItem.tsx`: Card item representing selected files.
  - `Navbar.tsx`: Blurred glassmorphic header.
- `/hooks`:
  - `usePdfConverter.ts`: React custom hook for PDF/Image processing.
- `/constants`:
  - `tools.ts`: Configuration metadata for all supported tools.