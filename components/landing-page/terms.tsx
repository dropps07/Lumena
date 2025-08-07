"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Terms() {
  return (
    <div className="relative min-h-screen">
      {/* Background with Noise Overlay */}
      <div
        className="absolute bottom-0 left-0 w-full h-full -z-[10] blur-gradient-bottom after:content-[''] after:fixed after:inset-0 after:opacity-40 after:mix-blend-overlay"
        style={{
          background:
            "radial-gradient(1920px 100% at 50% 100%, rgba(191, 108, 226, 0.6) 0%, rgba(77, 106, 235, 0.5) 50%, transparent 100%)",
          maskImage:
            "radial-gradient(1920px 100% at 50% 100%, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 50%, transparent 100%)",
          opacity: 1,
        }}
      />
      <main className="min-h-screen max-w-5xl mx-auto flex flex-col items-center justify-center px-4 md:px-6 lg:px-8 pt-32 pb-12 gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center flex flex-col gap-6 max-w-2xl mx-auto"
        >
          <div className="text-center flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white font-chillax font-bold">
              Terms &amp; Conditions
            </h1>
            <ul className="text-white text-left text-lg font-chillax space-y-4 mt-6">
              <li>
                <span className="font-bold">1. Subscription Terms</span><br />
                It&apos;s a free to use software :D
              </li>
              <li>
                <span className="font-bold">2. Payment Terms</span><br />
                No Paywalls, no subscriptions, no logins, just designs.
              </li>
              <li>
                <span className="font-bold">3. Usage Rights</span><br />
                This service is for personal use only.
              </li>
              <li>
                <span className="font-bold">4. Service Availability</span><br />
                We strive for 99.9% uptime but do not guarantee uninterrupted service. We reserve the right to modify or discontinue features.
              </li>
              <li>
                <span className="font-bold">5. Limitation of Liability</span><br />
                Our service is provided &quot;as is&quot; without warranties. We are not liable for any damages arising from service use.
              </li>
            </ul>
            <p className="text-white text-sm font-chillax mt-8">
              Last updated: 08/07/2025 (mm/dd/yyyy)
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
