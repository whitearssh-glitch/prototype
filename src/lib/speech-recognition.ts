/**
 * 무료 음성인식: Web Speech API (SpeechRecognition)
 * Chrome, Edge에서 동작. Safari/Firefox는 제한적.
 */

const SpeechRecognitionAPI =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition);

export function isSpeechRecognitionSupported(): boolean {
  return !!SpeechRecognitionAPI;
}

export interface ListenOptions {
  lang?: string; // 'ko-KR' | 'en-US'
  continuous?: boolean;
  maxDuration?: number; // ms, 최대 듣기 시간
  minDuration?: number; // ms, 최소 듣기 시간 (이 시간까지는 무조건 활성 유지)
}

/** 음성 인식 시작 → 인식된 문장으로 resolve. minDuration 동안은 무조건 듣기 유지 */
export function listen(options: ListenOptions = {}): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !SpeechRecognitionAPI) {
      resolve("");
      return;
    }

    const { lang = "en-US", continuous = false, maxDuration = 10000, minDuration = 5000 } = options;
    const Recognition = SpeechRecognitionAPI;
    const recognition = new Recognition();
    const startTime = Date.now();

    recognition.continuous = continuous;
    recognition.interimResults = false;
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    let resolved = false;
    let minTimer: ReturnType<typeof setTimeout> | null = null;

    const doResolve = (text: string) => {
      if (resolved) return;
      resolved = true;
      try {
        recognition.abort();
      } catch {
        // ignore
      }
      if (minTimer) clearTimeout(minTimer);
      resolve(text.trim());
    };

    const done = (text: string) => {
      if (resolved) return;
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);
      if (remaining > 0) {
        minTimer = setTimeout(() => doResolve(text), remaining);
      } else {
        doResolve(text);
      }
    };

    let transcript = "";
    const timeout =
      maxDuration > 0
        ? setTimeout(() => done(transcript), maxDuration)
        : null;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      const last = result[result.length - 1];
      transcript = (last?.transcript ?? "").trim();
    };

    recognition.onend = () => {
      if (resolved) return;
      if (transcript.trim()) {
        if (timeout) clearTimeout(timeout);
        done(transcript);
      }
    };

    recognition.onerror = (event: Event) => {
      const e = event as SpeechRecognitionErrorEvent;
      if (e.error === "no-speech" && !transcript.trim()) {
        return;
      }
      if (timeout) clearTimeout(timeout);
      if (!resolved) done(transcript || "");
    };

    try {
      recognition.start();
    } catch {
      if (timeout) clearTimeout(timeout);
      doResolve("");
    }
  });
}

/** 영어 문장과 인식 결과 간 단순 유사도 (소문자, 공백 정규화) */
export function matchTranscript(expected: string, heard: string): boolean {
  const n = expected.toLowerCase().replace(/\s+/g, " ").trim();
  const h = heard.toLowerCase().replace(/\s+/g, " ").trim();
  if (h.length === 0) return false;
  return n === h || n.includes(h) || h.includes(n);
}

/** 선택지 중 인식 결과와 가장 비슷한 것 찾기 */
export function findBestChoice(heard: string, choices: string[]): string | null {
  const h = heard.toLowerCase().trim();
  if (!h) return null;
  for (const c of choices) {
    if (matchTranscript(c, heard)) return c;
  }
  // 부분 일치: 인식 문장이 선택지에 포함되거나
  const partial = choices.find((c) => {
    const cLower = c.toLowerCase();
    return cLower.includes(h) || h.includes(cLower);
  });
  return partial ?? null;
}
