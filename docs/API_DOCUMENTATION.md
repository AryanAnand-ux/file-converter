# API Documentation

ConvertIO is a client-side application. No backend REST/GraphQL APIs exist. 

## Hook Signature: `usePdfConverter`

### Inputs (`ConvertOptions`)
- `toolSlug`: string (e.g. `split-pdf`)
- `files`: File[]
- `pageRange`: string (optional)
- `rotationAngle`: number (optional)
- `password`: string (optional)
- `watermarkText`: string (optional)
- `pageOrder`: number[] (optional)

### Returns
- `isConverting`: boolean
- `error`: string | null
- `convertedFileUrl`: string | null
- `convertedFileSize`: string | null
- `convert`: function
- `reset`: function