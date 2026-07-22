const warmed = new Set<string>();

/** Warm the browser HTTP cache for project/cover images. */
export function preloadImages(urls: readonly string[]): void {
  if (typeof window === "undefined") return;

  for (const url of urls) {
    if (!url || warmed.has(url)) continue;
    warmed.add(url);

    const img = new Image();
    img.decoding = "async";
    img.src = url;

    // Also hint via Cache Storage when available (best-effort).
    if ("caches" in window) {
      void caches.open("rose-project-images-v1").then((cache) => {
        void cache.match(url).then((hit) => {
          if (!hit) void cache.add(url).catch(() => undefined);
        });
      });
    }
  }
}

export function collectProjectImageUrls(
  items: ReadonlyArray<{ image?: string; gallery?: ReadonlyArray<{ src: string }> }>,
): string[] {
  const urls: string[] = [];
  for (const item of items) {
    if (item.image) urls.push(item.image);
    for (const shot of item.gallery ?? []) {
      if (shot.src) urls.push(shot.src);
    }
  }
  return urls;
}
