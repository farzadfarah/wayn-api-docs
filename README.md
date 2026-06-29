# WAYN API Documentation Portal

A ReadMe.io-style developer portal built with Next.js, React, TypeScript,
Tailwind CSS, shadcn/ui-style components, and Scalar for the API reference.

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
npm run start
```

## OpenAPI Source

The developer portal dynamically fetches the documentation index and OpenAPI specifications directly from remote storage (`https://stsproddgtl01.blob.core.windows.net/cn-public/readme/index.json`).
