"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-9999 flex items-start justify-center bg-white/10 backdrop-blur-sm">
      <div className="relative h-1 w-full overflow-hidden">
        <motion.div
          className="via-secondary absolute top-0 left-0 h-full w-full bg-linear-to-r from-transparent to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          style={{ width: "30%" }}
        />
      </div>
    </div>
  );
}
