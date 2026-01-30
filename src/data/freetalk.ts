/** 실전 대화 목업: 세션별 AI 발화 (A-B-A-B-A-B-A) */

export const FREETALK_TOPIC = "자기소개하기 (Greeting & Self-introduction)";

/** 1회차: 턴 1,3,5,7 = AI / 턴 2,4,6 = 학생 */
export const SESSION_1_AI: string[] = [
  "I am so happy to talk to you! How are you today?",
  "Great! I am happy, too! Are you a student?",
  "Nice to meet you! What is your name?",
  "Wonderful! It was nice talking. Let's do one more round!",
];

/** 2회차 */
export const SESSION_2_AI: string[] = [
  "Hi again! How are you feeling now?",
  "You are doing great! Are you smart?",
  "I am a teacher. Who are you?",
  "We did a great job today. Bye-bye! See you next time!",
];

export const HINT_PHRASES = [
  "I am happy / sad / hungry.",
  "I am a student.",
  "My name is ___.",
];
