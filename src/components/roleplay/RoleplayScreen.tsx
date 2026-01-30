"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react";
import ScreenLayout from "@/components/ScreenLayout";
import { speak } from "@/lib/tts";
import { listen, isSpeechRecognitionSupported, findBestChoice } from "@/lib/speech-recognition";
import {
  ROLEPLAY_SCENARIOS,
  CHARACTERS,
  type RoleplayScenario,
  type Character,
} from "@/data/roleplay";

interface Message {
  id: string;
  type: "ai" | "student";
  text: string;
  character?: Character;
}

function getRandomCharacter(): Character {
  return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
}

function getAiFirstText(scenario: RoleplayScenario): string {
  if (scenario.aiFirstVariants && Math.random() > 0.5) {
    return scenario.aiFirstVariants[
      Math.floor(Math.random() * scenario.aiFirstVariants.length)
    ];
  }
  return scenario.aiFirst;
}

export default function RoleplayScreen({ onComplete }: { onComplete?: () => void }) {
  const [character] = useState<Character>(() => getRandomCharacter());
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [phase, setPhase] = useState<"ai-first" | "student" | "ai-reaction">("ai-first");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showChoices, setShowChoices] = useState(false);
  const [showMic, setShowMic] = useState(false);
  const [showWrong, setShowWrong] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const scenario = ROLEPLAY_SCENARIOS[scenarioIndex];
  const isLastScenario = scenarioIndex >= ROLEPLAY_SCENARIOS.length - 1;

  const addMessage = useCallback(
    (type: "ai" | "student", text: string) => {
      const msg: Message = {
        id: `${Date.now()}-${type}`,
        type,
        text,
        character: type === "ai" ? character : undefined,
      };
      setMessages((m) => [...m, msg]);
      return msg;
    },
    [character]
  );

  useEffect(() => {
    if (!scenario) {
      onComplete?.();
      return;
    }
    if (phase === "ai-first") {
      const text = scenarioIndex === 0 ? scenario.aiFirst : getAiFirstText(scenario);
      addMessage("ai", text);
      speak(text).then(() => {
        setShowChoices(true);
        setShowMic(true);
        setPhase("student");
      });
    }
  }, [scenarioIndex, phase]);

  const handleChoice = (choice: string) => {
    setShowChoices(false);
    setShowMic(false);
    setShowWrong(false);
    addMessage("student", choice);
    setPhase("ai-reaction");
    speak(scenario.aiReaction).then(() => {
      addMessage("ai", scenario.aiReaction);
      if (isLastScenario) {
        setTimeout(() => setShowReview(true), 600);
      } else {
        setScenarioIndex((i) => i + 1);
        setPhase("ai-first");
      }
    });
  };

  /** 실제 음성인식 또는 엔터 시 선택지 매칭 */
  const handleMicOrEnter = useCallback(async () => {
    if (!showChoices || !showMic || !scenario) return;
    if (isListening) return;

    if (isSpeechRecognitionSupported()) {
      setIsListening(true);
      const transcript = await listen({ lang: "en-US", maxDuration: 8000 });
      setIsListening(false);
      const matched = findBestChoice(transcript, scenario.choices);
      if (matched) {
        handleChoice(matched);
      } else {
        handleWrongAnswer();
      }
    } else {
      handleChoice(scenario.choices[0]);
    }
  }, [showChoices, showMic, isListening, scenario]);

  const handleWrongAnswer = () => {
    setShowWrong(true);
    setTimeout(() => {
      setShowWrong(false);
      speak(scenario.choices[0]).then(() => {
        setShowChoices(true);
        setShowMic(true);
      });
    }, 1500);
  };

  if (showReview) {
    return (
      <ScreenLayout
        header={
          <div className="text-center">
            <p className="font-semibold text-selfit-pink">대화 완료!</p>
            <p className="text-sm text-gray-500">오늘 대화를 다시 볼 수 있어요</p>
          </div>
        }
        footer={
          <div className="flex justify-center">
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onComplete?.()}
              className="rounded-full bg-selfit-pink px-8 py-3 font-medium text-white shadow-lg hover:bg-selfit-pink-dark active:scale-98"
            >
              다음으로
            </motion.button>
          </div>
        }
      >
        <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto rounded-2xl bg-white/80 p-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === "student" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                  msg.type === "ai"
                    ? "rounded-bl-md bg-white shadow"
                    : "rounded-br-md bg-selfit-pink text-white"
                }`}
              >
                {msg.type === "ai" && msg.character && (
                  <div className="mb-1 flex items-center gap-1">
                    <span>{msg.character.avatar}</span>
                    <span className="text-xs font-medium text-gray-500">{msg.character.name}</span>
                  </div>
                )}
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
      </ScreenLayout>
    );
  }

  if (!scenario) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>대화를 모두 완료했어요!</p>
      </div>
    );
  }

  const bgImages = [
    "linear-gradient(135deg, #FFF5F7 0%, #FFE4E9 100%)",
    "linear-gradient(135deg, #FFF5F7 0%, #E8F4FF 100%)",
    "linear-gradient(135deg, #FFF5F7 0%, #E8FFE8 100%)",
    "linear-gradient(135deg, #FFF5F7 0%, #FFF0E4 100%)",
    "linear-gradient(135deg, #FFF5F7 0%, #F0E4FF 100%)",
  ];

  return (
    <ScreenLayout
      onKeyDown={(e) => e.key === "Enter" && handleMicOrEnter()}
      tabIndex={0}
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{character.avatar}</span>
            <span className="font-semibold text-gray-800">{character.name}</span>
          </div>
          <div className="flex gap-1">
            {ROLEPLAY_SCENARIOS.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i <= scenarioIndex ? "bg-selfit-pink" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      }
      footer={
        <>
          {showChoices && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 flex flex-wrap justify-center gap-2"
            >
              {scenario.choices.map((c) => (
                <button
                  key={c}
                  onClick={() => handleChoice(c)}
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow hover:bg-selfit-pink-light/50 active:scale-95"
                >
                  {c}
                </button>
              ))}
            </motion.div>
          )}
          {showMic && (
            <div className="flex flex-col items-center gap-2">
              {isListening && (
                <p className="text-sm text-selfit-pink animate-pulse">듣는 중...</p>
              )}
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={handleMicOrEnter}
                disabled={isListening}
                className={`flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg hover:bg-selfit-pink-dark active:scale-95 ${
                  isListening ? "bg-selfit-pink-dark ring-4 ring-selfit-pink-light" : "bg-selfit-pink"
                }`}
              >
                <Mic className="h-8 w-8" />
              </motion.button>
              <p className="text-xs text-gray-500">
                {isSpeechRecognitionSupported() ? "마이크 클릭 후 말하세요" : "클릭 또는 Enter = 말하기 완료"}
              </p>
            </div>
          )}
        </>
      }
    >
      <motion.div
        key={scenarioIndex}
        initial={{ opacity: 0, clipPath: "inset(50% 0 50% 0)" }}
        animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-[50vh] rounded-2xl p-4"
        style={{ background: bgImages[scenarioIndex] }}
      >
        {showWrong && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 rounded-xl bg-amber-100 p-3 text-center text-amber-800"
          >
            <span className="text-xl">!</span> 따라 읽어볼까요?
          </motion.div>
        )}
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${msg.type === "student" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.type === "ai"
                      ? "rounded-bl-md bg-white shadow"
                      : "rounded-br-md bg-selfit-pink text-white"
                  }`}
                >
                  {msg.type === "ai" && msg.character && (
                    <div className="mb-1 flex items-center gap-1">
                      <span>{msg.character.avatar}</span>
                      <span className="text-xs font-medium text-gray-500">
                        {msg.character.name}
                      </span>
                    </div>
                  )}
                  <p className="text-sm">{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </ScreenLayout>
  );
}
