"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Share2Icon, CheckIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useWallpaperStore } from "@/store/wallpaper";
import { Button } from "@/components/ui/button";

export function SaveShareButton() {
  const getShareableConfig = useWallpaperStore((s) => s.getShareableConfig);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const config = getShareableConfig();
      const res = await fetch("/api/gradients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!res.ok) throw new Error("Save failed");

      const saved = await res.json();
      const shareUrl = `${window.location.origin}/g/${saved.slug}`;
      await navigator.clipboard.writeText(shareUrl);

      setCopied(true);
      setShowToast(true);
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setShowToast(false), 2000);
    } catch {
      // silent fail for now — hook up an error pill later if needed
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      <Button
        variant="glass"
        onClick={handleShare}
        disabled={isSharing}
        className="w-fit"
      >
        {copied ? (
          <CheckIcon className="size-4" />
        ) : (
          <Share2Icon className="size-4" />
        )}
      </Button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]"
              >
                <div
                  className="
                    w-[160px] h-[40px] rounded-[13px]
                    bg-white
                    backdrop-blur-md
                    border border-white/40
                    text-black font-medium text-sm
                    relative overflow-hidden
                    flex items-center justify-center gap-2
                    shadow-lg
                  "
                >
                  <CheckIcon className="size-4" />
                  Copied!
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}