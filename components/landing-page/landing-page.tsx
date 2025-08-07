"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  
  const handleLaunch = () => {
    router.push("/editor");
  };
  return (
    <div className="relative min-h-screen">
    {/* Background with Noise Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-full -z-[10] blur-gradient-bottom after:content-[''] after:fixed after:inset-0 after:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] after:opacity-40 after:mix-blend-overlay" style={{
   background: 'radial-gradient(1920px 100% at 50% 100%, rgba(191, 108, 226, 0.6) 0%, rgba(77, 106, 235, 0.5) 50%, transparent 100%)',
   maskImage: 'radial-gradient(1920px 100% at 50% 100%, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 50%, transparent 100%)',
   opacity: 1
            }} />
      {/* Theme Toggle Button
      <div className="absolute top-6 right-6 z-10">
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="sm"
          className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div> */}

      {/* Main Content */}
      <main className="min-h-screen max-w-5xl mx-auto flex flex-col items-center justify-center px-4 md:px-6 lg:px-8 pt-32 pb-12 gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center flex flex-col gap-6 max-w-2xl mx-auto"
        >
          <div className="text-center flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white font-chillax font-bold">
                 Blend Colors. Drop Bangers.
               </h1>
               <p className="text-white-900 text-lg max-w-md mx-auto font-clash-display">
               Craft wallpapers and backgrounds that actually hits different.
               </p>
           </div>
          <div className="flex gap-2 items-center justify-center">
          <Button
  onClick={handleLaunch}
  className="
    w-[120px] h-[40px] rounded-[13px] 
    bg-white
    backdrop-blur-md
    border border-white/40
    text-black font-medium text-md
    relative overflow-hidden
    -translate-y-0.5
    hover:-translate-y-1 hover:text-black hover:bg-white
    active:-translate-y-px active:text-black active:bg-white
    transition-all duration-300 ease-out
  "
>
  Get started
</Button>
          </div>
        </motion.div>
        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          >
              <video 
              className="rounded-3xl"
              playsInline
              src="https://res.cloudinary.com/dhzomnepn/video/upload/v1754500999/preview-video.mp4"
              autoPlay={true}
              loop={true}
              muted={true}
              >
                <p className="text-gray-400">Video preview will be displayed here</p>
              </video>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-sm text-gray-400 flex items-center gap-2"
        >
          <p>© 2025 Lumena. All rights reserved.</p>
          <a className="underline hover:text-white transition-colors"
          href="/terms">
            Terms and Conditions.
          </a>
        </motion.footer>
      </main>
    </div>
  );
}
