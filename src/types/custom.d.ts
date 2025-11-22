// Custom ambient module declarations to satisfy TypeScript during Vercel build
// Não declare '@vercel/node' aqui para não conflitar com types oficiais
declare module "pdfjs-dist/legacy/build/pdf.js";
declare module "pdfjs-dist/legacy/build/pdf.mjs";
