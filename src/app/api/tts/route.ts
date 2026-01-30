import { NextRequest, NextResponse } from "next/server";

const OPENAI_SPEECH_URL = "https://api.openai.com/v1/audio/speech";

/** OpenAI TTS: 자연스러운 음성 생성 (API 키 필요) */
export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY가 설정되지 않았습니다." },
      { status: 503 }
    );
  }

  let body: { text: string; voice?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const voice = typeof body.voice === "string" && body.voice ? body.voice : "nova";
  const validVoices = ["alloy", "ash", "ballad", "coral", "echo", "fable", "onyx", "nova", "sage", "shimmer", "verse", "marin", "cedar"];
  const finalVoice = validVoices.includes(voice) ? voice : "nova";

  try {
    const res = await fetch(OPENAI_SPEECH_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice: finalVoice,
        speed: 0.9,
        response_format: "mp3",
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("OpenAI TTS error:", res.status, err);
      return NextResponse.json(
        { error: "TTS request failed", details: err },
        { status: res.status }
      );
    }

    const arrayBuffer = await res.arrayBuffer();
    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("TTS error:", e);
    return NextResponse.json(
      { error: "TTS failed" },
      { status: 500 }
    );
  }
}
