# Architecture Document

ConvertIO is built as a single-page client application using Next.js 16 (App Router) and Tailwind CSS 4.

## Key Architectures
1. **Next.js Client Actions**: All routing is dynamic. Individual tools are loaded based on their slug at `/tools/[slug]`.
2. **Local Worker Model**: Heavy PDF operations use `pdf-lib` and `pdfjs-dist` rendering. Worker scripts are loaded via standard public CDNs.
3. **Canvas-Based Processing**: Image resizing uses the HTML5 Canvas API to perform resizing, format changes, and quality adjustments.