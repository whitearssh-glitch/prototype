"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WarmupScreen from "@/components/warmup/WarmupScreen";
import GreatModal from "@/components/GreatModal";

export default function WarmupPage() {
  const router = useRouter();
  const [showGreat, setShowGreat] = useState(false);

  useEffect(() => {
    if (!showGreat) return;
    const t = setTimeout(() => {
      setShowGreat(false);
      router.push("/roleplay");
    }, 1000);
    return () => clearTimeout(t);
  }, [showGreat, router]);

  return (
    <>
      <WarmupScreen onComplete={() => setShowGreat(true)} />
      <GreatModal isOpen={showGreat} message="Great!" nextLabel="다음: 롤플레잉" />
    </>
  );
}
