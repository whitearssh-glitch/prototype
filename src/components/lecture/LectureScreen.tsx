"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import ScreenLayout from "@/components/ScreenLayout";
import { speak, playDing } from "@/lib/tts";
import { listen, isSpeechRecognitionSupported } from "@/lib/speech-recognition";
import { LECTURE_STEPS, LectureStep } from "@/data/lecture";

const TOPIC = "자기소개하기";
const COURSE = "Basic 01 Day 01";

interface LectureScreenProps {
  onComplete?: () => void;
}

/** I am _______. 인식 시 이름 부분만 추출 */
function extractNameFromTranscript(transcript: string): string {
  const t = transcript.trim();
  const match = t.match(/\bI\s+am\s+(.+)/i) || t.match(/\b(?:my name is|I'm)\s+(.+)/i);
  if (match) return match[1].trim();
  return t || "Friend";
}

export default function LectureScreen({ onComplete }: LectureScreenProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [showMic, setShowMic] = useState(false);
  const [userName, setUserName] = useState("");
  const [micSuccess, setMicSuccess] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [imageError, setImageError] = useState(false);
  const nextTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step = LECTURE_STEPS[stepIndex] as LectureStep | undefined;

  const goNext = useCallback(() => {
    if (stepIndex >= LECTURE_STEPS.length - 1) {
      onComplete?.();
      return;
    }
    setStepIndex((i) => i + 1);
    setSubtitleVisible(false);
    setShowMic(false);
    setMicSuccess(false);
  }, [stepIndex, onComplete]);

  // Type A: 음성 재생 + 자막 표시 → 완료 후 0.5초 뒤 다음 (화면 1 포함)
  useEffect(() => {
    if (!step) return;
    if (step.type === "A") {
      setSubtitleVisible(true);
      setIsSpeaking(true);
      speak(step.voice).then(() => {
        if (nextTimeoutRef.current) clearTimeout(nextTimeoutRef.current);
        setIsSpeaking(false);
        nextTimeoutRef.current = setTimeout(goNext, 500);
      });
      return () => {
        if (nextTimeoutRef.current) {
          clearTimeout(nextTimeoutRef.current);
          nextTimeoutRef.current = null;
        }
      };
    }
    // Type B: 음성 재생 후 마이크 버튼 표시 (화면 2, 4, 6... / 화면 10: I am _______ 짧은 알림음)
    if (step.type === "B") {
      setIsSpeaking(true);
      speak(step.voice).then(() => {
        if (step.placeholder != null && step.text?.includes("_______")) {
          playDing();
        }
        setIsSpeaking(false);
        setShowMic(true);
      });
    }
  }, [stepIndex, step?.type, step?.placeholder, step?.text, goNext]);

  const isPlaceholderStep = step?.placeholder != null && step?.text?.includes("_______");

  const handleMicClick = useCallback(async () => {
    if (isListening) return;
    const useStt = isSpeechRecognitionSupported();

    if (useStt) {
      setIsListening(true);
      const transcript = await listen({ lang: "en-US", minDuration: 5000, maxDuration: 10000 });
      setIsListening(false);
      if (isPlaceholderStep && !userName) {
        const name = extractNameFromTranscript(transcript);
        setUserName(name || "Friend");
      }
      setMicSuccess(true);
      playDing();
      setTimeout(goNext, transcript ? 800 : 500);
    } else {
      if (isPlaceholderStep && !userName) setUserName("Friend");
      setMicSuccess(true);
      playDing();
      setTimeout(goNext, 600);
    }
  }, [isListening, isPlaceholderStep, userName, goNext]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && showMic && step?.type === "B") {
      handleMicClick();
    }
  };

  if (!step) return null;

  return (
    <ScreenLayout
      header={
        <div className="text-center">
          <p className="text-sm text-gray-500">{COURSE}</p>
          <p className="font-semibold text-selfit-pink">
            TOPIC: {TOPIC}
          </p>
        </div>
      }
      footer={
        step.type === "B" && showMic ? (
          <div className="flex flex-col items-center gap-2">
            {isListening && (
              <p className="text-sm font-medium text-selfit-pink animate-pulse">듣는 중...</p>
            )}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition hover:bg-selfit-pink-dark active:scale-95 ${
                isListening ? "bg-selfit-pink-dark ring-4 ring-selfit-pink-light" : "bg-selfit-pink"
              }`}
              onClick={handleMicClick}
              disabled={isListening}
            >
              <Mic className="h-10 w-10" />
            </motion.button>
          </div>
        ) : step.type === "A" ? (
          <div className="min-h-[4rem] rounded-2xl bg-white/60 px-4 py-3">
            {subtitleVisible && step.subtitle && (
              <p className="text-center text-lg text-gray-700">
                {step.subtitle}
              </p>
            )}
          </div>
        ) : null
      }
    >
      <div
        className="flex flex-col items-center justify-center gap-6"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* 선생님 이미지: 강의 코너 전체에서 항상 유지 (크게, 배경 없음) */}
        <motion.div
          animate={{
            scale: isSpeaking ? [1, 1.02, 1] : 1,
            rotate: isSpeaking ? [0, 2, -2, 0] : 0,
          }}
          transition={{
            duration: 1.5,
            repeat: isSpeaking ? Infinity : 0,
            repeatType: "reverse",
          }}
          className="flex shrink-0 items-center justify-center"
        >
          {!imageError ? (
            <Image
              src="/selena_image.png"
              alt="선생님 셀레나"
              width={320}
              height={320}
              className="h-72 w-72 object-contain sm:h-80 sm:w-80"
              onError={() => setImageError(true)}
              unoptimized
            />
          ) : (
            <span className="text-8xl">👩‍🏫</span>
          )}
        </motion.div>

        {step.type === "A" && step.subtitle && (
          <p className="text-center text-xl text-gray-800">
            {step.subtitle}
          </p>
        )}

        {step.type === "B" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg"
          >
            <p className="text-center text-2xl font-medium text-gray-800">
              {isPlaceholderStep ? (
                userName ? (
                  <>I am {userName}.</>
                ) : (
                  <>I am _______.</>
                )
              ) : (
                step.text
              )}
            </p>
            {micSuccess && (
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-4 text-center text-2xl text-green-500"
              >
                🔔 딩동!
              </motion.p>
            )}
          </motion.div>
        )}
      </div>
    </ScreenLayout>
  );
}
