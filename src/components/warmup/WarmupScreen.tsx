"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import ScreenLayout from "@/components/ScreenLayout";
import { speak } from "@/lib/tts";
import { listen, isSpeechRecognitionSupported } from "@/lib/speech-recognition";
import { getFlattenedSentences } from "@/data/warmup";

type SpeedLevel = 1 | 2 | 3;
type StepInSpeed1 = 1 | 2 | 3; // 1: en+voice+stt, 2: en+stt, 3: ko+stt
type StepInSpeed2 = 1 | 2; // 1: en+stt, 2: ko+stt
type StepInSpeed3 = 1; // 1: ko+stt

const PRAISE = ["Good!", "Great!", "Perfect!"];

interface WarmupScreenProps {
  onComplete?: () => void;
}

export default function WarmupScreen({ onComplete }: WarmupScreenProps) {
  const flat = getFlattenedSentences();
  const [speed, setSpeed] = useState<SpeedLevel>(1);
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [step1, setStep1] = useState<StepInSpeed1>(1);
  const [step2, setStep2] = useState<StepInSpeed2>(1);
  const [showMic, setShowMic] = useState(false);
  const [praise, setPraise] = useState<string | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [hintTimer, setHintTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [isListening, setIsListening] = useState(false);

  const current = flat[sentenceIdx];
  const isLastSentence = sentenceIdx >= flat.length - 1;

  const goNextSentence = useCallback(() => {
    setPraise(PRAISE[speed - 1] ?? "Perfect!");
    setTimeout(() => {
      setPraise(null);
      if (sentenceIdx >= flat.length - 1) {
        if (speed < 3) {
          setSpeed((s) => (s + 1) as SpeedLevel);
          setSentenceIdx(0);
          setStep1(1);
          setStep2(1);
        } else {
          onComplete?.();
        }
      } else {
        setSentenceIdx((i) => i + 1);
        setStep1(1);
        setStep2(1);
      }
      setShowMic(false);
      setHintVisible(false);
    }, 1200);
  }, [sentenceIdx, speed, flat.length, onComplete]);

  const handleSttSuccess = useCallback(() => {
    if (speed === 1) {
      if (step1 < 3) {
        setStep1((s) => (s + 1) as StepInSpeed1);
        setShowMic(false);
        if (step1 === 2) {
          setShowMic(true);
        } else if (step1 === 1) {
          setShowMic(true);
        }
      } else {
        goNextSentence();
      }
    } else if (speed === 2) {
      if (step2 < 2) {
        setStep2((s) => (s + 1) as StepInSpeed2);
        setShowMic(true);
      } else {
        goNextSentence();
      }
    } else {
      goNextSentence();
    }
  }, [speed, step1, step2, goNextSentence]);

  // Speed 1: step1 === 1 → TTS 재생 후 마이크
  useEffect(() => {
    if (!current) return;
    if (speed === 1 && step1 === 1) {
      speak(current.en).then(() => setShowMic(true));
      return;
    }
    if (speed === 1 && step1 === 2) {
      setShowMic(true);
      return;
    }
    if (speed === 1 && step1 === 3) {
      setShowMic(true);
      return;
    }
    if (speed === 2 && step2 === 1) {
      setShowMic(true);
      // 3초 후 힌트
      const t = setTimeout(() => setHintVisible(true), 3000);
      setHintTimer(t);
      return () => clearTimeout(t);
    }
    if (speed === 2 && step2 === 2) {
      setHintVisible(false);
      setShowMic(true);
      const t = setTimeout(() => setHintVisible(true), 3000);
      setHintTimer(t);
      return () => clearTimeout(t);
    }
    if (speed === 3) {
      setShowMic(true);
      const t = setTimeout(() => setHintVisible(true), 3000);
      setHintTimer(t);
      return () => clearTimeout(t);
    }
  }, [speed, step1, step2, sentenceIdx]);

  useEffect(() => {
    return () => {
      if (hintTimer) clearTimeout(hintTimer);
    };
  }, [hintTimer]);

  const showEn = (speed === 1 && step1 <= 2) || (speed === 2 && step2 === 1);
  const showKo = (speed === 1 && step1 === 3) || (speed === 2 && step2 === 2) || speed === 3;

  return (
    <ScreenLayout
      header={
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Basic 01 Day 01</p>
          <div className="flex gap-1 rounded-full bg-white p-1 shadow-inner">
            {([1, 2, 3] as const).map((s) => (
              <span
                key={s}
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  speed === s ? "bg-selfit-pink text-white" : "text-gray-400"
                }`}
              >
                속도 {s}
              </span>
            ))}
          </div>
        </div>
      }
      footer={
        showMic ? (
          <div className="flex flex-col items-center gap-3">
            {hintVisible && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-selfit-pink"
              >
                💡 힌트: {current?.en.split(" ")[0]}
              </motion.p>
            )}
            {isListening && (
              <p className="text-sm text-selfit-pink animate-pulse">듣는 중...</p>
            )}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg hover:bg-selfit-pink-dark active:scale-95 ${
                isListening ? "bg-selfit-pink-dark ring-4 ring-selfit-pink-light" : "bg-selfit-pink"
              }`}
              disabled={isListening}
              onClick={async () => {
                setHintVisible(false);
                if (hintTimer) clearTimeout(hintTimer);
                if (isSpeechRecognitionSupported()) {
                  setIsListening(true);
                  await listen({ lang: "en-US", maxDuration: 8000 });
                  setIsListening(false);
                }
                handleSttSuccess(); // STT 지원 시 말한 후, 미지원 시 클릭만으로 진행
              }}
            >
              <Mic className="h-10 w-10" />
            </motion.button>
            <p className="text-xs text-gray-500">
              {isSpeechRecognitionSupported() ? "마이크 클릭 후 말하세요" : "클릭 = 말하기 완료"}
            </p>
          </div>
        ) : null
      }
    >
      <div className="flex flex-col items-center justify-center gap-8">
        {praise && (
          <motion.p
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold text-selfit-pink"
          >
            {praise}
          </motion.p>
        )}
        {!praise && current && (
          <>
            {showEn && (
              <motion.p
                key={`en-${sentenceIdx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-2xl font-medium text-gray-800"
              >
                {current.en}
              </motion.p>
            )}
            {showKo && (
              <motion.p
                key={`ko-${sentenceIdx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-xl text-gray-600"
              >
                {current.ko}
              </motion.p>
            )}
          </>
        )}
      </div>
    </ScreenLayout>
  );
}
