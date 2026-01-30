"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Flame, MessageCircle, MessageSquare, Award } from "lucide-react";

const corners = [
  { href: "/lecture", label: "강의", icon: BookOpen, color: "bg-selfit-pink" },
  { href: "/warmup", label: "워밍업", icon: Flame, color: "bg-selfit-pink-light" },
  { href: "/roleplay", label: "롤플레잉", icon: MessageCircle, color: "bg-selfit-pink" },
  { href: "/freetalk", label: "실전 대화", icon: MessageSquare, color: "bg-selfit-pink-light" },
  { href: "/recap", label: "리캡", icon: Award, color: "bg-selfit-pink" },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFF5F7] px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2 text-4xl font-bold text-selfit-pink"
      >
        SELFit
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 text-gray-600"
      >
        셀레나와 함께하는 스피킹
      </motion.p>
      <div className="flex w-full max-w-sm flex-col gap-4">
        {corners.map(({ href, label, icon: Icon, color }, i) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
          >
            <Link
              href={href}
              className={`flex items-center gap-4 rounded-full ${color} px-6 py-4 text-white shadow-lg transition hover:opacity-90 active:scale-[0.98]`}
            >
              <Icon className="h-6 w-6" />
              <span className="font-semibold">{label}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
