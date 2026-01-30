"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Volume2, Home, Sparkles } from "lucide-react";
import ScreenLayout from "@/components/ScreenLayout";
import { speak } from "@/lib/tts";
import { loadRecapData } from "@/lib/recap-storage";

const NEXT_DAY_TOPIC = "Basic 01 Day 02 · 감정 표현하기";

export default function RecapScreen() {
  const [data, setData] = useState(loadRecapData());
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    setData(loadRecapData());
  }, []);

  const playClosing = () => {
    if (played) return;
    setPlayed(true);
    speak("오늘 정말 잘했어! 내일 또 만나자!", "ko-KR").then(() => setPlayed(false));
  };

  const maxCount = Math.max(...data.targetExpressionCount.map((x) => x.count), 1);

  return (
    <ScreenLayout
      header={
        <div className="text-center">
          <p className="text-sm text-gray-500">Basic 01 Day 01</p>
          <p className="font-semibold text-selfit-pink">리캡 · 오늘의 리포트</p>
        </div>
      }
    >
      <div className="flex flex-col gap-6 pb-8">
        {/* 타깃 표현 사용 빈도 */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white p-4 shadow-lg"
        >
          <h3 className="mb-3 text-sm font-semibold text-gray-600">오늘 사용한 표현</h3>
          <div className="space-y-2">
            {data.targetExpressionCount.map((item, i) => (
              <div key={item.phrase} className="flex items-center gap-2">
                <span className="w-28 shrink-0 text-sm text-gray-700">{item.phrase}</span>
                <div className="h-5 flex-1 overflow-hidden rounded-full bg-selfit-pink-light/40">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / maxCount) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full rounded-full bg-selfit-pink"
                  />
                </div>
                <span className="w-6 text-right text-sm font-medium text-selfit-pink">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 스피킹 포인트 */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-gradient-to-br from-selfit-pink to-selfit-pink-dark p-5 text-white shadow-xl"
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6" />
            <span className="text-sm font-medium">오늘 획득 포인트</span>
          </div>
          <motion.p
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="mt-2 text-center text-4xl font-bold"
          >
            {data.totalPoints || 150} P
          </motion.p>
          <p className="mt-1 text-center text-sm opacity-90">잘했어요!</p>
        </motion.section>

        {/* 주제 집중도 */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white p-4 shadow-lg"
        >
          <h3 className="mb-2 text-sm font-semibold text-gray-600">주제 집중도</h3>
          <p className="mb-2 text-xs text-gray-500">자기소개 주제에 얼마나 집중했는지 볼까요?</p>
          <div className="h-4 overflow-hidden rounded-full bg-gray-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.topicFocusScore}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full rounded-full bg-gradient-to-r from-selfit-pink-light to-selfit-pink"
            />
          </div>
          <p className="mt-2 text-right text-sm font-medium text-selfit-pink">{data.topicFocusScore}%</p>
        </motion.section>

        {/* 더 멋진 표현 (문법 교정) */}
        {data.grammarTips && data.grammarTips.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl bg-white p-4 shadow-lg"
          >
            <h3 className="mb-3 text-sm font-semibold text-gray-600">더 멋진 표현</h3>
            <p className="mb-3 text-xs text-gray-500">이렇게 말하면 더 완벽해!</p>
            <div className="space-y-4">
              {data.grammarTips.map((tip, i) => (
                <div key={i} className="rounded-xl bg-selfit-pink-light/20 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500">내가 말한 것</span>
                    <button
                      type="button"
                      onClick={() => speak(tip.after)}
                      className="flex items-center gap-1 rounded-full bg-selfit-pink px-2 py-1 text-xs text-white"
                    >
                      <Volume2 className="h-3 w-3" /> 들어보기
                    </button>
                  </div>
                  <p className="mb-1 text-sm text-gray-600 line-through">{tip.before}</p>
                  <p className="mb-1 text-sm font-medium text-gray-800">{tip.after}</p>
                  <p className="text-xs text-selfit-pink">{tip.explanation}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* 다음 차시 */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border-2 border-dashed border-selfit-pink-light bg-white/60 p-4"
        >
          <p className="text-center text-sm font-medium text-gray-600">다음에 배울 내용</p>
          <p className="mt-1 text-center text-base font-semibold text-selfit-pink">{NEXT_DAY_TOPIC}</p>
        </motion.section>

        {/* 마무리 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <button
            type="button"
            onClick={playClosing}
            className="flex items-center gap-2 rounded-full bg-selfit-pink px-6 py-3 text-white shadow-lg hover:bg-selfit-pink-dark active:scale-98"
          >
            <Volume2 className="h-5 w-5" />
            셀레나의 마무리 인사 듣기
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-selfit-pink shadow-lg ring-2 ring-selfit-pink-light hover:bg-selfit-pink-light/20 active:scale-98"
          >
            <Home className="h-5 w-5" />
            메인으로 돌아가기
          </Link>
        </motion.div>
      </div>
    </ScreenLayout>
  );
}
