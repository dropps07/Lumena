"use client";

import { useState, useEffect, Suspense } from "react";
import { SplashScreen } from "./splash-screen";
import { AnimatePresence } from "framer-motion";
import { Loader2Icon } from "lucide-react";

interface SplashScreenWrapperProps {
  children: React.ReactNode;
}

export function SplashScreenWrapper({ children }: SplashScreenWrapperProps) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Only show splash if not already shown in this session
    const splashShown = sessionStorage.getItem("splashShown");
    if (splashShown) {
      setShowSplash(false);
      return;
    }
    const timer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem("splashShown", "true");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        <Suspense
          fallback={
            <Loader2Icon className="size-8 text-primary animate-spin" />
          }
        >
          {showSplash ? <SplashScreen key="splash" /> : children}
        </Suspense>
      </AnimatePresence>
    </>
  );
}