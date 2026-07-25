interface ResponsivePicture {
  url: string;
  thumbnailUrl?: string | null;
  url1024?: string | null;
  url768?: string | null;
  url512?: string | null;
}

export function buildSrcSet(picture: ResponsivePicture): {
  src: string;
  srcSet: string | undefined;
} {
  const candidates = [
    picture.thumbnailUrl ? { url: picture.thumbnailUrl, width: 248 } : null,
    picture.url512 ? { url: picture.url512, width: 512 } : null,
    picture.url768 ? { url: picture.url768, width: 768 } : null,
    picture.url1024 ? { url: picture.url1024, width: 1024 } : null,
  ].filter((c): c is { url: string; width: number } => c !== null);

  return {
    src:
      picture.url1024 ??
      picture.url768 ??
      picture.url512 ??
      picture.thumbnailUrl ??
      picture.url,
    srcSet:
      candidates.length > 0
        ? candidates.map((c) => `${c.url} ${c.width}w`).join(', ')
        : undefined,
  };
}
