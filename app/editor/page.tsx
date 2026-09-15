"use client";
import DesktopApp from "@/components/core-ui/desktop-app";
import MobileApp from "@/components/core-ui/mobile-app";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FONTS } from "@/lib/constants";
import { useWallpaperStore } from "@/store/wallpaper";
import { useSafariCheck } from "@/hooks/use-safari-check";
import { generateHarmoniousPalette } from "@/lib/utils/color";

export default function Editor() {
  const [isMobile, setIsMobile] = useState(false);
  const { isSafari, shouldShowPWAPrompt, dismissPWAPrompt } = useSafariCheck();
  const store = useWallpaperStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is Tailwind's md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const currentFont = FONTS.find((f) => f.name === store.fontFamily);
    if (!currentFont?.variable) {
      const availableWeights = currentFont?.weights || [];
      const closestWeight = availableWeights.reduce((prev, curr) =>
        Math.abs(curr - store.fontWeight) < Math.abs(prev - store.fontWeight)
          ? curr
          : prev
      );
      store.setFontWeight(closestWeight);
    }
  }, [store]);

  useEffect(() => {
    if (shouldShowPWAPrompt) {
      toast("Install our app for the best experience", {
        description: "Tap the share button and select 'Add to Home Screen'",
        duration: Infinity,
        closeButton: true,
        onDismiss: dismissPWAPrompt,
      });
    }
  }, [shouldShowPWAPrompt, dismissPWAPrompt]);

  const downloadImage = async () => {
    try {
      const previewCanvas = document.querySelector(
        "#wallpaper canvas"
      ) as HTMLCanvasElement;
      if (!previewCanvas) return;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = store.resolution.width;
      tempCanvas.height = store.resolution.height;
      const ctx = tempCanvas.getContext("2d")!;

      // Draw the preview canvas
      ctx.drawImage(
        previewCanvas,
        0,
        0,
        store.resolution.width,
        store.resolution.height
      );

      // Draw the text
      if (store.sizeMode === "text") {
        ctx.save();

        // Set font properties
        const fontString = `${store.isItalic ? "italic" : ""} ${
          store.fontWeight
        } ${store.fontSize * 16}px ${store.fontFamily}`;
        ctx.font = fontString;
        ctx.fillStyle = store.textColor;
        ctx.textAlign = store.textAlign as CanvasTextAlign;
        ctx.textBaseline = "middle";
        ctx.globalAlpha = store.opacity / 100;

        // Set text decorations
        if (store.textShadow.blur > 0) {
          ctx.shadowColor = store.textShadow.color;
          ctx.shadowBlur = store.textShadow.blur;
          ctx.shadowOffsetX = store.textShadow.offsetX;
          ctx.shadowOffsetY = store.textShadow.offsetY;
        }

        // Calculate text position
        let x = store.resolution.width / 2 + store.textPosition.x;
        if (store.textAlign === "left") {
          x = 20 + store.textPosition.x;
        } else if (store.textAlign === "right") {
          x = store.resolution.width - 20 + store.textPosition.x;
        }

        // Handle multiline text
        const lines = store.text.split("\n");
        const lineHeight = store.fontSize * 16 * store.lineHeight;
        const totalHeight = lines.length * lineHeight;
        const startY =
          store.resolution.height / 2 - totalHeight / 2 + store.textPosition.y;

        lines.forEach((line, index) => {
          const y = startY + index * lineHeight + lineHeight / 2;
          ctx.fillText(line, x, y);

          // Draw text decorations
          if (store.isUnderline || store.isStrikethrough) {
            const textMetrics = ctx.measureText(line);
            const textWidth = textMetrics.width;
            let decorationY = y;

            if (store.isUnderline) {
              decorationY = y + textMetrics.actualBoundingBoxDescent + 2;
            }
            if (store.isStrikethrough) {
              decorationY = y;
            }

            let startX = x;
            if (store.textAlign === "center") {
              startX = x - textWidth / 2;
            } else if (store.textAlign === "right") {
              startX = x - textWidth;
            }

            ctx.beginPath();
            ctx.strokeStyle = store.textColor;
            ctx.lineWidth = Math.max(1, store.fontSize * 0.05);
            ctx.moveTo(startX, decorationY);
            ctx.lineTo(startX + textWidth, decorationY);
            ctx.stroke();
          }
        });

        ctx.restore();
      }

      if (store.sizeMode === "image" && store.logoImage) {
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = store.logoImage as string;
        });

        const maxWidth = store.resolution.width * 0.5;
        const maxHeight = store.resolution.height * 0.5;
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
        const width = img.width * scale;
        const height = img.height * scale;

        ctx.save();
        ctx.globalAlpha = store.opacity / 100;
        ctx.filter = `drop-shadow(${store.textShadow.offsetX}px ${store.textShadow.offsetY}px ${store.textShadow.blur}px ${store.textShadow.color})`;
        ctx.drawImage(
          img,
          store.resolution.width / 2 - width / 2 + store.textPosition.x,
          store.resolution.height / 2 - height / 2 + store.textPosition.y,
          width,
          height
        );
        ctx.restore();
      }

      // Handle download based on browser
      if (isSafari) {
        const dataUrl = tempCanvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `gradii-${store.resolution.width}x${store.resolution.height}.png`;
        link.click();
      } else {
        const blob = await new Promise<Blob>((resolve) =>
          tempCanvas.toBlob((blob) => resolve(blob!), "image/png")
        );
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `gradii-${store.resolution.width}x${store.resolution.height}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      toast.success("Download will start shortly");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download image");
    }
  };

  const copyImage = async () => {
    try {
      const previewCanvas = document.querySelector(
        "#wallpaper canvas"
      ) as HTMLCanvasElement;
      if (!previewCanvas) return;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = store.resolution.width;
      tempCanvas.height = store.resolution.height;
      const ctx = tempCanvas.getContext("2d")!;

      // Draw the preview canvas
      ctx.drawImage(
        previewCanvas,
        0,
        0,
        store.resolution.width,
        store.resolution.height
      );

      // Handle text/logo drawing same as download
      if (store.sizeMode === "text") {
        ctx.save();

        // Set font properties
        const fontString = `${store.isItalic ? "italic" : ""} ${
          store.fontWeight
        } ${store.fontSize * 16}px ${store.fontFamily}`;
        ctx.font = fontString;
        ctx.fillStyle = store.textColor;
        ctx.textAlign = store.textAlign as CanvasTextAlign;
        ctx.textBaseline = "middle";
        ctx.globalAlpha = store.opacity / 100;

        // Set text decorations
        if (store.textShadow.blur > 0) {
          ctx.shadowColor = store.textShadow.color;
          ctx.shadowBlur = store.textShadow.blur;
          ctx.shadowOffsetX = store.textShadow.offsetX;
          ctx.shadowOffsetY = store.textShadow.offsetY;
        }

        // Calculate text position
        let x = store.resolution.width / 2 + store.textPosition.x;
        if (store.textAlign === "left") {
          x = 20 + store.textPosition.x;
        } else if (store.textAlign === "right") {
          x = store.resolution.width - 20 + store.textPosition.x;
        }

        // Handle multiline text
        const lines = store.text.split("\n");
        const lineHeight = store.fontSize * 16 * store.lineHeight;
        const totalHeight = lines.length * lineHeight;
        const startY =
          store.resolution.height / 2 - totalHeight / 2 + store.textPosition.y;

        lines.forEach((line, index) => {
          const y = startY + index * lineHeight + lineHeight / 2;
          ctx.fillText(line, x, y);

          // Draw text decorations
          if (store.isUnderline || store.isStrikethrough) {
            const textMetrics = ctx.measureText(line);
            const textWidth = textMetrics.width;
            let decorationY = y;

            if (store.isUnderline) {
              decorationY = y + textMetrics.actualBoundingBoxDescent + 2;
            }
            if (store.isStrikethrough) {
              decorationY = y;
            }

            let startX = x;
            if (store.textAlign === "center") {
              startX = x - textWidth / 2;
            } else if (store.textAlign === "right") {
              startX = x - textWidth;
            }

            ctx.beginPath();
            ctx.strokeStyle = store.textColor;
            ctx.lineWidth = Math.max(1, store.fontSize * 0.05);
            ctx.moveTo(startX, decorationY);
            ctx.lineTo(startX + textWidth, decorationY);
            ctx.stroke();
          }
        });

        ctx.restore();
      }

      if (store.sizeMode === "image" && store.logoImage) {
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = store.logoImage as string;
        });

        const maxWidth = (store.resolution.width * store.fontSize) / 100; // Convert percentage to pixels
        const maxHeight = (store.resolution.height * store.fontSize) / 100;
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
        const width = img.width * scale;
        const height = img.height * scale;

        ctx.save();
        ctx.globalAlpha = store.opacity / 100;
        ctx.filter = `drop-shadow(${store.textShadow.offsetX}px ${store.textShadow.offsetY}px ${store.textShadow.blur}px ${store.textShadow.color})`;
        ctx.drawImage(
          img,
          store.resolution.width / 2 - width / 2 + store.textPosition.x,
          store.resolution.height / 2 - height / 2 + store.textPosition.y,
          width,
          height
        );
        ctx.restore();
      }

      // Convert to blob and copy
      try {
        // Try modern Clipboard API first
        const blob = await new Promise<Blob>((resolve) =>
          tempCanvas.toBlob((blob) => resolve(blob!), "image/png")
        );
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
      } catch (e) {
        console.error(e);
        // Fallback for Safari
        const dataUrl = tempCanvas.toDataURL("image/png");
        const textArea = document.createElement("textarea");
        textArea.value = dataUrl;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          document.body.removeChild(textArea);
        } catch (err) {
          document.body.removeChild(textArea);
          console.error(err);
          throw new Error("Failed to copy to clipboard");
        }
      }

      toast.success("Image copied to clipboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy image");
    }
  };

  const handleColorChange = (color: string) => {
    switch (store.activeColorType) {
      case "text":
        store.setTextColor(color);
        break;
      case "background":
        store.setBackgroundColor(color);
        break;
      case "gradient":
        if (store.activeColor !== null) {
          store.updateColor(color, store.activeColor);
        }
        break;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (e.g., 10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      toast.error("Failed to read image file");
    };

    reader.onloadend = () => {
      const loadPromise = new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          store.backgroundImage = reader.result as string;
          resolve(true);
        };
        img.onerror = reject;
        img.src = reader.result as string;
      });

      toast.promise(loadPromise, {
        loading: "Loading image...",
        success: "Image uploaded successfully",
        error: "Failed to load image",
      });
    };

    reader.readAsDataURL(file);
  };

  const handlePaletteChange = () => {
    const palette = generateHarmoniousPalette();

    store.setBackgroundColor(palette.backgroundColor);
    store.setTextColor(palette.textColor);
    store.setTextShadow({
      color: palette.glowColor,
      blur: store.textShadow.blur,
      offsetX: store.textShadow.offsetX,
      offsetY: store.textShadow.offsetY,
    });

    store.setCircles(
      palette.colors.map((color, i) => ({
        color,
        cx: store.circles[i]?.cx ?? Math.random() * 100,
        cy: store.circles[i]?.cy ?? Math.random() * 100,
      }))
    );
  };

  const AppComponent = isMobile ? MobileApp : DesktopApp;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col">
        <AppComponent
          {...store}
          fonts={FONTS}
          isSafari={isSafari}
          downloadImage={downloadImage}
          copyImage={copyImage}
          handleColorChange={handleColorChange}
          handleImageUpload={handleImageUpload}
          handlePaletteChange={handlePaletteChange}
        />
        
        {/* Informational Section */}
        <section className="w-full bg-secondary/50 border-t border-primary/10 py-12 px-4 md:px-8">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="spacing spacing-subheading">
                  <div className="spacing mt-12"
                    style={{
                      width: '720px',
                      height: '354px',
                      maxWidth: '100%',
                      margin: '0 auto',
                      fontFamily: 'var(--font-clash-display), "Clash Display", sans-serif',
                      fontSize: '16px',
                      lineHeight: '1.6',
                      overflow: 'hidden',
                      padding: '24px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <h2 data-link="false" className="text-2xl md:text-3xl font-semibold text-foreground mb-4"
                      style={{
                        fontFamily: 'var(--font-clash-display), "Clash Display", sans-serif',
                        fontSize: '32px',
                        marginBottom: '24px',
                        lineHeight: '1.3',
                        fontWeight: '600'
                      }}
                    >
                      Create flawless mesh gradients
                    </h2>
                    <p className="subtitle-1 lh-md text-lg text-muted-foreground"
                      style={{
                        fontFamily: 'var(--font-clash-display), "Clash Display", sans-serif',
                        fontSize: '18px',
                        lineHeight: '1.2',
                        marginBottom: '25px',
                        fontWeight: '400'
                      }}
                    >
                      Achieve the sophisticated look of a <strong>multi-layered mesh gradient without the complex code</strong>. This tool lets you visually build and fine-tune intricate color gradients, add depth with noise and blur effects, and download the design with a single click.
                    </p>
                    
                    <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4"
                      style={{
                        fontFamily: 'var(--font-clash-display), "Clash Display", sans-serif',
                        fontSize: '32px',
                        marginBottom: '24px',
                        lineHeight: '1.3',
                        fontWeight: '600'
                      }}
                    >
                      How does it work?
                    </h2>
                    <p className="subtitle-1 lh-md text-lg text-muted-foreground"
                      style={{
                        fontFamily: 'var(--font-clash-display), "Clash Display", sans-serif',
                        fontSize: '18px',
                        lineHeight: '1.2',
                        fontWeight: '400'
                      }}
                    >
                      Begin by placing and selecting your color points on the canvas. Drag them around to shape the gradient&apos;s flow and color interactions in real-time. Use the powerful controls to refine your artwork: change the blend mode, increase the blur for a softer look, or add a subtle noise effect for texture. When your masterpiece is complete, simply copy the generated <kbd>CSS</kbd> code to use in your project.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
    </div>
  );
} 