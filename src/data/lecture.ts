export type LectureStepType = "A" | "B";

export interface LectureStep {
  type: LectureStepType;
  voice: string;
  subtitle?: string;
  text?: string;
  placeholder?: string; // 화면10: I am _______
}

export const LECTURE_STEPS: LectureStep[] = [
  {
    type: "A",
    voice:
      "Hello, everyone! Welcome to SELFit! 셀레나와 함께 하는 재미있는 스피킹! SELFit에 온 걸 환영해. 나한테도 인사해 줄래?",
    subtitle: "Hello, everyone! Welcome to SELFit!",
  },
  {
    type: "B",
    voice: "Hello, SELENA!",
    text: "Hello, SELENA!",
  },
  {
    type: "A",
    voice:
      "이제부터 재미있게 수업을 시작해 보자! 오늘 우리가 쓸 표현은 Nice to meet you! 처음 만났을 때 이렇게 말해. 자, 따라 말해볼까?",
    subtitle: "Nice to meet you! 만나서 반갑습니다!",
  },
  {
    type: "B",
    voice: "Nice to meet you!",
    text: "Nice to meet you!",
  },
  {
    type: "A",
    voice:
      "그리고 난 다음에는 내가 누구인지 소개해야 해. 이럴 때는 I am 이라는 표현을 쓸 수 있어. 먼저 한 번 따라 해볼까?",
    subtitle: "I am 나는 ~예요",
  },
  {
    type: "B",
    voice: "I am",
    text: "I am",
  },
  {
    type: "A",
    voice: "맞았어! 그리고 그 뒤에 이름을 넣으면 돼.",
    subtitle: "I am + 이름",
  },
  {
    type: "B",
    voice: "I am SELENA.",
    text: "I am SELENA.",
  },
  {
    type: "A",
    voice: "자, 이번엔 네 이름도 넣어서 말해 볼래?",
    subtitle: "I am + 이름",
  },
  {
    type: "B",
    voice: "I am",
    text: "I am _______.",
    placeholder: "I am _______.",
  },
  {
    type: "A",
    voice:
      "그리고 내가 어떤 사람인지 말할 때는 I am 뒤에 나의 특징을 넣으면 돼. 나는 행복하다고 말하고 싶다면?",
    subtitle: "I am + 특징",
  },
  {
    type: "B",
    voice: "I am happy.",
    text: "I am happy.",
  },
  {
    type: "A",
    voice: "나는 학생이라고 말하고 싶다면?",
    subtitle: "I am + 특징",
  },
  {
    type: "B",
    voice: "I am a student.",
    text: "I am a student.",
  },
  {
    type: "A",
    voice: "좋아! 그럼 지금부터 스피킹을 시작해 보자~ Here we go!",
  },
];
