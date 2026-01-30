export interface RoleplayScenario {
  id: number;
  scene: string;
  aiFirst: string;
  choices: string[];
  aiReaction: string;
  // 재진입 시 랜덤 질문용
  aiFirstVariants?: string[];
}

export const ROLEPLAY_SCENARIOS: RoleplayScenario[] = [
  {
    id: 1,
    scene: "학교 정문",
    aiFirst: "Hi! I am Selena. What is your name?",
    aiFirstVariants: ["What's your name?", "Tell me your name."],
    choices: ["I am Minsoo", "I am Jane", "I am Tom"],
    aiReaction: "Nice to meet you! Let's go in.",
  },
  {
    id: 2,
    scene: "교실",
    aiFirst: "How are you today?",
    choices: ["I am happy", "I am hungry", "I am tired"],
    aiReaction: "Good! I am happy, too.",
  },
  {
    id: 3,
    scene: "자기소개",
    aiFirst: "Who are you?",
    choices: ["I am a student", "I am a boy", "I am a girl"],
    aiReaction: "Yes, you are a great student!",
  },
  {
    id: 4,
    scene: "특징",
    aiFirst: "I am smart. How about you?",
    choices: ["I am smart, too", "I am fast", "I am strong"],
    aiReaction: "Awesome! We are both smart.",
  },
  {
    id: 5,
    scene: "마무리",
    aiFirst: "I am cool today. What about you?",
    choices: ["I am cool, too", "I am pretty", "I am tall"],
    aiReaction: "We are so cool! Bye-bye!",
  },
];

export interface Character {
  id: string;
  name: string;
  avatar: string; // emoji or placeholder
  voiceLabel: string;
}

export const CHARACTERS: Character[] = [
  { id: "selena", name: "Selena", avatar: "👩", voiceLabel: "여" },
  { id: "max", name: "Max", avatar: "👨", voiceLabel: "남" },
  { id: "luna", name: "Luna", avatar: "👧", voiceLabel: "여아" },
  { id: "leo", name: "Leo", avatar: "👦", voiceLabel: "남아" },
];
