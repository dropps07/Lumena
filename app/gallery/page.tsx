
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface GradientConfig {
  backgroundColor?: string;
  circles?: { color: string }[];
  text?: string;
}

interface GradientListItem {
  slug: string;
  config: GradientConfig;
  createdAt: string;
}

export default function GalleryPage() {
  const [gradients, setGradients] = useState<GradientListItem[]>([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    setStatus("loading");
    fetch(`/api/gradients?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setGradients(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [page]);

  return (
    <div className="min-h-screen bg-secondary p-8">
      <h1 className="text-2xl font-semibold mb-6">Gallery</h1>

      {status === "loading" && (
        <p className="text-sm text-muted-foreground">Loading...</p>
      )}
      {status === "error" && (
        <p className="text-sm text-destructive-foreground">Failed to load gallery.</p>
      )}

      {status === "ready" && gradients.length === 0 && (
        <p className="text-sm text-muted-foreground">No gradients saved yet.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {gradients.map((g) => (
          <Link
            key={g.slug}
            href={`/g/${g.slug}`}
            className="group flex flex-col gap-2 rounded-2xl border border-primary/10 bg-foreground/5 p-3 hover:border-primary/30 transition-all duration-300"
          >
            <div
              className="w-full aspect-video rounded-xl"
              style={{ backgroundColor: g.config.backgroundColor ?? "#000" }}
            />
            <div className="flex items-center gap-1">
              {(g.config.circles ?? []).slice(0, 5).map((c, i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: c.color }}
                />
              ))}
            </div>
            {g.config.text && (
              <p className="text-xs text-muted-foreground truncate">
                {g.config.text}
              </p>
            )}
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="glass"
          className="w-fit"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">Page {page}</span>
        <Button
          variant="glass"
          className="w-fit"
          onClick={() => setPage((p) => p + 1)}
          disabled={gradients.length < 20}
        >
          Next
        </Button>
      </div>
    </div>
  );
}