# Bug Report & Fixes Log

- **Bug 1 (Fixed)**: `image-to-pdf` did not support multi-selection in file pickers.
  * *Fix*: Enabled `multiple` select in `UploadArea.tsx`.
- **Bug 2 (Fixed)**: Changing options during conversion.
  * *Fix*: Implemented strict `disabled={isConverting}` states across all inputs.