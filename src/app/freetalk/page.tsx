"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FreeTalkScreen from "@/components/freetalk/FreeTalkScreen";
import GreatModal from "@/components/GreatModal";

export default function FreeTalkPage() {
  const router = useRouter();
  const [showGreat, setShowGreat] = useState(false);

  useEffect(() => {
    if (!showGreat) return;
    const t = setTimeout(() => {
      setShowGreat(false);
      router.push("/recap");
    }, 1000);
    return () => clearTimeout(t);
  }, [showGreat, router]);

  return (
    <>
      <FreeTalkScreen onComplete={() => setShowGreat(true)} />
      <GreatModal isOpen={showGreat} message="Great!" nextLabel="다음: 리캡" />
    </>
  );
}
