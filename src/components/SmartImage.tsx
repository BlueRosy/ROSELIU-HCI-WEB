import { useEffect, useRef, useState } from "react";

type SmartImageProps = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
};

function isSvg(src: string) {
  return src.toLowerCase().split("?")[0]?.endsWith(".svg") ?? false;
}

function isReady(img: HTMLImageElement, src: string) {
  if (!img.complete) return false;
  // Broken images are complete with naturalWidth 0 — do not treat as ready.
  if (img.naturalWidth > 0) return true;
  // Some SVG documents report 0×0 even when painted; only accept if no error.
  if (isSvg(src) && img.currentSrc) return true;
  return false;
}

/**
 * Image with soft loading state + graceful error fallback.
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
    if (!img) return;
    if (img.complete && img.naturalWidth === 0 && !isSvg(src)) {
      setStatus("error");
      return;
    }
    if (isReady(img, src)) {
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
        key={src}
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        onLoad={() => setStatus("ok")}
        onError={() => setStatus("error")}
        className={`${imgClassName} transition-[opacity,transform] duration-500 ease-out ${
          status === "ok" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
