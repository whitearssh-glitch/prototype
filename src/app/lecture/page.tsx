"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LectureScreen from "@/components/lecture/LectureScreen";
import GreatModal from "@/components/GreatModal";

export default function LecturePage() {
  const router = useRouter();
  const [showGreat, setShowGreat] = useState(false);

  useEffect(() => {
    if (!showGreat) return;
    const t = setTimeout(() => {
      setShowGreat(false);
      router.push("/warmup");
    }, 1000);
    return () => clearTimeout(t);
  }, [showGreat, router]);

  return (
    <>
      <LectureScreen onComplete={() => setShowGreat(true)} />
      <GreatModal
        isOpen={showGreat}
        message="Great!"
        nextLabel="다음: 워밍업"
      />
    </>
  );
}
