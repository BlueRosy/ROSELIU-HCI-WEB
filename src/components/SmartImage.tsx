import { useEffect, useState } from "react";

type SmartImageProps = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
};

/**
 * Image with soft loading state + graceful error fallback.
 * Uses native browser cache; pair with preloadProjectImages for warm cache.
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

  useEffect(() => {
    setStatus("loading");
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {status === "loading" && (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-cream/80 via-surface to-primary/5"
          aria-hidden
        />
      )}
      {status === "error" && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-cream/60 px-3 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-slate"
          aria-hidden
        >
          Preview unavailable
        </div>
      )}
      <img
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
