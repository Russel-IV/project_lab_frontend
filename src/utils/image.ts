const AVATAR_MAX_DIMENSION = 64;
const AVATAR_QUALITY = 0.85;

/**
 * Resizes an image file to fit within maxDimension (preserving aspect ratio)
 * and re-encodes it as WebP via the canvas API. Falls back to whatever
 * format the browser's canvas encoder actually produces if WebP isn't
 * supported (reflected in the returned blob's type), rather than throwing.
 */
export async function convertImageToWebp(
  file: File,
  maxDimension: number = AVATAR_MAX_DIMENSION,
  quality: number = AVATAR_QUALITY,
): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    throw new Error('Canvas is not supported in this browser.');
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', quality),
  );
  if (!blob) {
    throw new Error('Failed to process the selected image.');
  }

  const extension = blob.type === 'image/webp' ? 'webp' : blob.type.split('/')[1];
  const baseName = file.name.replace(/\.[^./]+$/, '');
  return new File([blob], `${baseName}.${extension}`, { type: blob.type });
}
