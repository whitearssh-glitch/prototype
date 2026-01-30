"use client";

import { motion, AnimatePresence } from "framer-motion";

interface GreatModalProps {
  isOpen: boolean;
  message?: string;
  nextLabel?: string;
}

export default function GreatModal({
  isOpen,
  message = "Great!",
  nextLabel,
}: GreatModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="relative flex flex-col items-center justify-center rounded-3xl bg-white px-12 py-8 shadow-2xl"
          >
            {/* 폭죽 파티클 */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              {[...Array(24)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-selfit-pink"
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos((i * 15 * Math.PI) / 180) * 120,
                    y: Math.sin((i * 15 * Math.PI) / 180) * 120,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.8 }}
                />
              ))}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`b-${i}`}
                  className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-yellow-300"
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos((i * 30 * Math.PI) / 180) * 80,
                    y: Math.sin((i * 30 * Math.PI) / 180) * 80,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                />
              ))}
            </div>
            <span className="relative z-10 text-4xl font-bold text-selfit-pink">
              {message}
            </span>
            {nextLabel && (
              <span className="relative z-10 mt-2 text-sm text-gray-500">
                {nextLabel}
              </span>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
