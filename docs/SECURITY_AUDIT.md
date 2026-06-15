# Security Audit

- **Zero Data Exposure**: No files are sent to a server. Processing is done in sandboxed browser RAM.
- **No Analytics Leakage**: Content is handled strictly in local scopes.
- **Secure Encryption**: PDF encryption uses RC4 128-bit encryption. Decryption supports RC4 and AES-256 via `@pdfsmaller/pdf-decrypt`.