# Performance Report

- **Lazy Rendering**: Previews are loaded on-demand using `IntersectionObserver` to conserve memory.
- **Dynamic Limits**: Enforced size caps protect browser tabs from memory overflow:
  - Image resizing / Image-to-PDF: 25MB per file.
  - PDF Merge: 150MB total.
  - Other single PDF tools: 100MB per file.