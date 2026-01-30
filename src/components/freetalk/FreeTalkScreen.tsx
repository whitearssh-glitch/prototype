"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react";
import ScreenLayout from "@/components/ScreenLayout";
import { speak } from "@/lib/tts";
import { appendFreetalkMessages } from "@/lib/recap-storage";
import { FREETALK_TOPIC, SESSION_1_AI, SESSION_2_AI, HINT_PHRASES } from "@/data/freetalk";

interface ChatMessage {
  id: string;
  type: "ai" | "student";
  text: string;
}

const TOTAL_SESSIONS = 2;
const TURNS_PER_SESSION = 3; // 학생 발화 3턴

interface FreeTalkScreenProps {
  onComplete?: () => void;
}

export default function FreeTalkScreen({ onComplete }: FreeTalkScreenProps) {
  const [session, setSession] = useState(1);
  const [turnInSession, setTurnInSession] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showHint, setShowHint] = useState(true);
  const [showMic, setShowMic] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [studentBuffer, setStudentBuffer] = useState<string[]>([]);
  const allStudentMessagesRef = useRef<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const aiSentences = session === 1 ? SESSION_1_AI : SESSION_2_AI;

  const addMessage = useCallback((type: "ai" | "student", text: string) => {
    const id = `${Date.now()}-${type}`;
    setMessages((m) => [...m, { id, type, text }]);
    if (type === "student") setStudentBuffer((b) => [...b, text]);
    return id;
  }, []);

  /** AI 턴: 문장 재생 후 마이크 표시(또는 마지막이면 다음 세션으로) */
  useEffect(() => {
    const aiIndex = turnInSession;
    if (aiIndex >= aiSentences.length) return;
    const text = aiSentences[aiIndex];
    addMessage("ai", text);
    const isLastAiInSession = aiIndex >= aiSentences.length - 1;
    speak(text).then(() => {
      if (isLastAiInSession) {
        setShowMic(false);
        if (session >= TOTAL_SESSIONS) {
          onComplete?.();
        } else {
          setSession((s) => s + 1);
          setTurnInSession(0);
          setStudentBuffer([]);
        }
      } else {
        setShowMic(true);
        setShowHint(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- addMessage/onComplete/session/aiSentences stable
  }, [session, turnInSession]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleStudentReply = useCallback(
    (reply: string) => {
      setShowMic(false);
      addMessage("student", reply);
      const nextTurn = turnInSession + 1;
      const thisSessionReplies = [...studentBuffer, reply];
      if (nextTurn > TURNS_PER_SESSION) {
        allStudentMessagesRef.current = [...allStudentMessagesRef.current, ...thisSessionReplies];
        if (session >= TOTAL_SESSIONS) {
          const final = allStudentMessagesRef.current;
          appendFreetalkMessages(
            final.length ? final : ["I am happy.", "I am a student.", "My name is Minsoo."]
          );
          onComplete?.();
        } else {
          setSession((s) => s + 1);
          setTurnInSession(0);
          setStudentBuffer([]);
        }
      } else {
        setTurnInSession(nextTurn);
      }
    },
    [turnInSession, session, addMessage, onComplete, studentBuffer]
  );

  /** 실제 음성인식 또는 엔터/힌트 클릭으로 답변 전송 */
  const handleMicOrHint = useCallback(async () => {
    if (!showMic) return;
    if (isListening) return;

    if (isSpeechRecognitionSupported()) {
      setIsListening(true);
      const transcript = await listen({ lang: "en-US", maxDuration: 8000 });
      setIsListening(false);
      handleStudentReply(transcript.trim() || HINT_PHRASES[0]);
    } else {
      handleStudentReply(HINT_PHRASES[0]);
    }
  }, [showMic, isListening, handleStudentReply]);

  return (
    <ScreenLayout
      onKeyDown={(e) => e.key === "Enter" && handleMicOrHint()}
      tabIndex={0}
      header={
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-selfit-pink">실전 대화 · {FREETALK_TOPIC}</p>
          <span className="rounded-full bg-white px-3 py-1 text-sm text-gray-600 shadow-sm">
            {session}/{TOTAL_SESSIONS}
          </span>
        </div>
      }
      footer={
        <>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 flex flex-wrap justify-center gap-2"
            >
              {HINT_PHRASES.map((h) => (
                <button
                  key={h}
                  onClick={() => {
                    setShowHint(false);
                    handleStudentReply(h);
                  }}
                  className="rounded-full bg-white px-4 py-2 text-sm text-gray-700 shadow hover:bg-selfit-pink-light/30 active:scale-95"
                >
                  {h}
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
                onClick={handleMicOrHint}
                disabled={isListening}
                className={`flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg hover:bg-selfit-pink-dark active:scale-95 ${
                  isListening ? "bg-selfit-pink-dark ring-4 ring-selfit-pink-light" : "bg-selfit-pink"
                }`}
              >
                <Mic className="h-8 w-8" />
              </motion.button>
              <p className="text-xs text-gray-500">
                {isSpeechRecognitionSupported() ? "마이크 클릭 후 말하세요" : "힌트 클릭 또는 Enter"}
              </p>
            </div>
          )}
        </>
      }
    >
      <div
        className="relative min-h-[45vh] rounded-2xl bg-gradient-to-b from-white/80 to-selfit-pink-light/20 p-4"
        ref={scrollRef}
      >
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,#fff5f7_0%,#ffe4eb_100%)] opacity-60" />
        <div className="relative flex flex-col gap-3">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${msg.type === "student" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    msg.type === "ai"
                      ? "rounded-bl-md bg-white shadow"
                      : "rounded-br-md bg-selfit-pink text-white"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ScreenLayout>
  );
}
