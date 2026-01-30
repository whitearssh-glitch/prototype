"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RoleplayScreen from "@/components/roleplay/RoleplayScreen";
import GreatModal from "@/components/GreatModal";

export default function RoleplayPage() {
  const router = useRouter();
  const [showGreat, setShowGreat] = useState(false);

  useEffect(() => {
    if (!showGreat) return;
    const t = setTimeout(() => {
      setShowGreat(false);
      router.push("/freetalk");
    }, 1000);
    return () => clearTimeout(t);
  }, [showGreat, router]);

  return (
    <>
      <RoleplayScreen onComplete={() => setShowGreat(true)} />
      <GreatModal isOpen={showGreat} message="Great!" nextLabel="다음: 실전 대화" />
    </>
  );
}
