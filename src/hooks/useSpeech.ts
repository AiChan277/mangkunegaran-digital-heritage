import { useCallback, useEffect, useRef, useState } from "react";

/** BCP 47 prefixes we accept for each content language. */
const VOICE_PREFIX: Record<string, string[]> = {
  id: ["id", "in"],
  en: ["en"],
  jv: ["jv"],
  ms: ["ms"],
  th: ["th"],
  vi: ["vi"],
  fil: ["fil", "tl"],
  km: ["km"],
  lo: ["lo"],
  my: ["my"],
  tet: ["tet"],
  es: ["es"],
};

function findVoice(lang: string): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const prefixes = VOICE_PREFIX[lang] ?? [lang];
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => prefixes.some((p) => v.lang.toLowerCase().replace("_", "-").startsWith(p))) ?? null;
}

export type SpeechState = "idle" | "playing" | "paused";

/**
 * Text-to-speech through the browser's built-in engine (Web Speech API).
 * `available` stays false until a voice for the language is confirmed,
 * so the UI can hide the control instead of showing a broken one.
 */
export function useSpeech(lang: string) {
  const [available, setAvailable] = useState(false);
  const [state, setState] = useState<SpeechState>("idle");
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const check = () => {
      voiceRef.current = findVoice(lang);
      setAvailable(!!voiceRef.current);
    };
    check();
    window.speechSynthesis.addEventListener("voiceschanged", check);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", check);
      window.speechSynthesis.cancel();
    };
  }, [lang]);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setState("idle");
  }, []);

  const play = useCallback(
    (text: string) => {
      const synth = window.speechSynthesis;
      if (state === "paused") {
        synth.resume();
        setState("playing");
        return;
      }
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if (voiceRef.current) {
        u.voice = voiceRef.current;
        u.lang = voiceRef.current.lang;
      }
      u.rate = 0.95;
      u.onend = () => setState("idle");
      u.onerror = () => setState("idle");
      synth.speak(u);
      setState("playing");
    },
    [state],
  );

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setState("paused");
  }, []);

  return { available, state, play, pause, stop };
}
