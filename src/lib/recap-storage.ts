/** 리캡에서 사용할 데이터 (프로토타입: localStorage) */

export interface GrammarTip {
  before: string;
  after: string;
  explanation: string;
}

export interface RecapData {
  targetExpressionCount: { phrase: string; count: number }[];
  totalPoints: number;
  topicFocusScore: number; // 0–100
  grammarTips: GrammarTip[];
  freetalkMessages: string[];
}

const STORAGE_KEY = "selfit_recap_data";

export function saveRecapData(data: Partial<RecapData>): void {
  if (typeof window === "undefined") return;
  const existing = loadRecapData();
  const merged: RecapData = {
    targetExpressionCount: data.targetExpressionCount ?? existing.targetExpressionCount ?? [],
    totalPoints: data.totalPoints ?? existing.totalPoints ?? 0,
    topicFocusScore: data.topicFocusScore ?? existing.topicFocusScore ?? 80,
    grammarTips: data.grammarTips ?? existing.grammarTips ?? [],
    freetalkMessages: data.freetalkMessages ?? existing.freetalkMessages ?? [],
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

export function loadRecapData(): RecapData {
  if (typeof window === "undefined") {
    return {
      targetExpressionCount: [],
      totalPoints: 0,
      topicFocusScore: 0,
      grammarTips: [],
      freetalkMessages: [],
    };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultRecapData();
    return { ...getDefaultRecapData(), ...JSON.parse(raw) };
  } catch {
    return getDefaultRecapData();
  }
}

function getDefaultRecapData(): RecapData {
  return {
    targetExpressionCount: [
      { phrase: "I am", count: 12 },
      { phrase: "Nice to meet you", count: 3 },
    ],
    totalPoints: 150,
    topicFocusScore: 80,
    grammarTips: [
      { before: "I am happy today.", after: "I am happy today!", explanation: "감정을 강하게 말할 땐 느낌표를 써요." },
      { before: "She am a student.", after: "She is a student.", explanation: "'She' 뒤에는 'is'를 써요." },
    ],
    freetalkMessages: [],
  };
}

export function appendFreetalkMessages(messages: string[]): void {
  const data = loadRecapData();
  saveRecapData({
    freetalkMessages: [...(data.freetalkMessages ?? []), ...messages],
  });
}
