export interface WarmupSentence {
  en: string;
  ko: string;
}

export interface WarmupBlock {
  title: string;
  sentences: WarmupSentence[];
}

export const WARMUP_DATA: WarmupBlock[] = [
  {
    title: "회화 표현",
    sentences: [{ en: "Nice to meet you!", ko: "만나서 반가워요!" }],
  },
  {
    title: "패턴 1",
    sentences: [{ en: "I am happy.", ko: "나는 행복해요." }],
  },
  {
    title: "패턴 1 단어 치환",
    sentences: [
      { en: "I am sad.", ko: "나는 슬퍼요." },
      { en: "I am hungry.", ko: "나는 배고파요." },
    ],
  },
  {
    title: "패턴 2",
    sentences: [{ en: "I am a student.", ko: "나는 학생이에요." }],
  },
  {
    title: "패턴 2 단어 치환",
    sentences: [
      { en: "I am a boy.", ko: "나는 남자아이에요." },
      { en: "I am a girl.", ko: "나는 여자아이에요." },
    ],
  },
];

// 평탄화: [ { blockIdx, sentenceIdx, en, ko } ]
export function getFlattenedSentences(): {
  blockIdx: number;
  sentenceIdx: number;
  en: string;
  ko: string;
}[] {
  const result: { blockIdx: number; sentenceIdx: number; en: string; ko: string }[] = [];
  WARMUP_DATA.forEach((block, blockIdx) => {
    block.sentences.forEach((s, sentenceIdx) => {
      result.push({
        blockIdx,
        sentenceIdx,
        en: s.en,
        ko: s.ko,
      });
    });
  });
  return result;
}
