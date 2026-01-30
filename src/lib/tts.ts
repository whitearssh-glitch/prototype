const TTS_RATE_EN = 0.88;
const TTS_RATE_KO = 0.82; // 한국어는 조금 더 느리게 → 더 자연스럽게

function detectLang(text: string): string {
  if (/[가-힣]/.test(text)) return "ko-KR";
  return "en-US";
}

/** 한국어: Windows 'Microsoft 하이미/선희' 등 자연스러운 음성 우선 */
function getPreferredVoiceKo(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const ko = voices.filter((v) => v.lang.startsWith("ko"));
  if (ko.length === 0) return null;

  // Windows 자연스러운 한국어 음성 (하이미, 선희 등)
  const natural = ko.find((v) => /heami|sunhi|하이미|선희|natural|neural|premium/i.test(v.name));
  if (natural) return natural;

  // Google 한국어 (Chrome)
  const google = ko.find((v) => /Google|한국어/i.test(v.name) && !/Mobile|Compact/i.test(v.name));
  if (google) return google;

  // Microsoft 한국어
  const ms = ko.find((v) => /Microsoft/i.test(v.name) && !/Mobile|Compact/i.test(v.name));
  if (ms) return ms;

  // 여성 음성 (이름에 Female, Woman 등)
  const female = ko.find((v) => /female|woman|female 1/i.test(v.name));
  if (female) return female;

  return ko[0] ?? null;
}

/** 영어: Google, Microsoft 등 품질 좋은 음성 우선 */
function getPreferredVoiceEn(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const en = voices.filter((v) => v.lang.startsWith("en"));
  if (en.length === 0) return null;

  const preferred = en.find(
    (v) => /Google|Microsoft|Natural|Online|Female|Woman/i.test(v.name) && !/Mobile|Compact/i.test(v.name)
  );
  if (preferred) return preferred;

  const female = en.find((v) => /female|woman|zira|samantha/i.test(v.name));
  if (female) return female;

  return en[0] ?? null;
}

/** 사용 가능한 음성 중 더 자연스러운 음성 우선 선택 */
function getPreferredVoice(lang: string): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  if (lang.startsWith("ko")) return getPreferredVoiceKo(voices);
  return getPreferredVoiceEn(voices);
}

let voiceCache: { en: SpeechSynthesisVoice | null; ko: SpeechSynthesisVoice | null } = { en: null, ko: null };

function getVoice(lang: string): SpeechSynthesisVoice | null {
  const key = lang.startsWith("ko") ? "ko" : "en";
  if (voiceCache[key]) return voiceCache[key];
  const v = getPreferredVoice(lang);
  voiceCache[key] = v;
  return v;
}

/** 브라우저 TTS로 재생 (자연스러운 음성 자동 선택) */
export function speak(text: string, lang?: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }

    const targetLang = lang ?? detectLang(text);

    // Chrome 등은 음성 목록이 나중에 로드되므로 한 번만 새로고침
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        voiceCache = { en: null, ko: null };
      };
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang;
    utterance.rate = targetLang.startsWith("ko") ? TTS_RATE_KO : TTS_RATE_EN;
    utterance.pitch = 1;

    const voice = getVoice(targetLang);
    if (voice) utterance.voice = voice;

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeak() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/** 짧은 알림 효과음 (딩동) */
export function playDing(): void {
  if (typeof window === "undefined") return;
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // ignore
  }
}
