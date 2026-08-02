import { useEffect, useRef, useState } from "react";

type SmartImageProps = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
};

function isReady(img: HTMLImageElement, src: string) {
  if (!img.complete) return false;
  // SVG often reports naturalWidth 0 in some browsers even when loaded.
  if (src.toLowerCase().includes(".svg")) return true;
  return img.naturalWidth > 0;
}

/**
 * Image with soft loading state + graceful error fallback.
 * Handles cached images and SVG naturalWidth quirks.
 */
export default function SmartImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  loading = "lazy",
  fetchPriority = "auto",
}: SmartImageProps) {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setStatus("loading");
    const img = imgRef.current;
    if (img && isReady(img, src)) {
      setStatus("ok");
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {status === "loading" && (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-section/80 via-surface to-primary/5"
          aria-hidden
        />
      )}
      {status === "error" && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-section/60 px-3 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-slate"
          aria-hidden
        >
          Preview unavailable
        </div>
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        onLoad={() => setStatus("ok")}
        onError={() => setStatus("error")}
        className={`${imgClassName} transition-opacity duration-300 ${
          status === "ok" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
