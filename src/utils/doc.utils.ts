export const generateDocumentObjectKey = (originalName: string) => {
  const timestamp = Date.now();
  const safeName = originalName.replace(/\s+/g, '-').toLowerCase();

  return `documents/${timestamp}-${safeName}`;
};