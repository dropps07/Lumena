"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useWallpaperStore } from "@/store/wallpaper";
import { CanvasPreview } from "@/components/core-ui/canvas-preview";

const DISPLAY_WIDTH = 600; // container width, tweak as you like

export default function SharedGradientPage() {
  const { slug } = useParams<{ slug: string }>();
  const loadConfig = useWallpaperStore((s) => s.loadConfig);
  const [status, setStatus] = useState<"loading" | "ready" | "not-found">("loading");

  const resolution = useWallpaperStore((s) => s.resolution);
  const text = useWallpaperStore((s) => s.text);
  const fontSize = useWallpaperStore((s) => s.fontSize);
  const fontWeight = useWallpaperStore((s) => s.fontWeight);
  const letterSpacing = useWallpaperStore((s) => s.letterSpacing);
  const fontFamily = useWallpaperStore((s) => s.fontFamily);
  const opacity = useWallpaperStore((s) => s.opacity);
  const lineHeight = useWallpaperStore((s) => s.lineHeight);
  const textColor = useWallpaperStore((s) => s.textColor);
  const isItalic = useWallpaperStore((s) => s.isItalic);
  const isUnderline = useWallpaperStore((s) => s.isUnderline);
  const isStrikethrough = useWallpaperStore((s) => s.isStrikethrough);
  const textShadow = useWallpaperStore((s) => s.textShadow);
  const textPosition = useWallpaperStore((s) => s.textPosition);
  const textAlign = useWallpaperStore((s) => s.textAlign);
  const sizeMode = useWallpaperStore((s) => s.sizeMode);
  const logoImage = useWallpaperStore((s) => s.logoImage);

  useEffect(() => {
    fetch(`/api/gradients/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => {
        loadConfig(data.config);
        setStatus("ready");
      })
      .catch(() => setStatus("not-found"));
  }, [slug, loadConfig]);

  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen text-sm text-muted-foreground">Loading gradient...</div>;
  }
  if (status === "not-found") {
    return <div className="flex items-center justify-center h-screen text-sm text-muted-foreground">Gradient not found.</div>;
  }

  // Scale factor: how much smaller the display box is vs the real resolution
  const zoom = DISPLAY_WIDTH / resolution.width;
  const displayHeight = resolution.height * zoom;

  return (
    <div className="flex items-center justify-center h-screen bg-secondary">
      <div
        className="relative rounded-2xl overflow-hidden border border-primary/10"
        style={{ width: DISPLAY_WIDTH, height: displayHeight }}
      >
        <div
          style={{
            width: resolution.width,
            height: resolution.height,
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
          }}
        >
          <CanvasPreview />
          <div className="absolute inset-0 flex items-center justify-center z-40">
            {sizeMode === "text" ? (
              <p
                style={{
                  fontSize: `${fontSize}em`,
                  fontWeight: fontWeight,
                  letterSpacing: `${letterSpacing}em`,
                  fontFamily: fontFamily,
                  opacity: opacity / 100,
                  lineHeight: lineHeight,
                  color: textColor,
                  fontStyle: isItalic ? "italic" : "normal",
                  textDecoration: `${isUnderline ? "underline" : ""} ${
                    isStrikethrough ? "line-through" : ""
                  }`.trim(),
                  textShadow: `${textShadow.offsetX}px ${textShadow.offsetY}px ${textShadow.blur}px ${textShadow.color}`,
                  transform: `translate(${textPosition.x}px, ${textPosition.y}px)`,
                  whiteSpace: "pre-wrap",
                  textAlign: textAlign,
                }}
              >
                {text}
              </p>
            ) : (
              logoImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoImage}
                  alt="Logo"
                  style={{
                    maxWidth: `${fontSize}%`,
                    maxHeight: `${fontSize}%`,
                    opacity: opacity / 100,
                    transform: `translate(${textPosition.x}px, ${textPosition.y}px)`,
                    filter: `drop-shadow(${textShadow.offsetX}px ${textShadow.offsetY}px ${textShadow.blur}px ${textShadow.color})`,
                  }}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}