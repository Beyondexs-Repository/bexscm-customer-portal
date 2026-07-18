"use client";

import { useRef } from "react";
import { Loader2, Mic } from "lucide-react";

export default function VoiceSearch({
  voiceStatus,
  onVoiceStatusChange,
  onTranscript,
}) {
  const recognitionRef = useRef(null);

  function startVoiceSearch() {
    if (voiceStatus !== "idle") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    recognitionRef.current?.abort();

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    let heardTranscript = false;

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      onVoiceStatusChange("listening");
    };

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();

      if (transcript) {
        heardTranscript = true;
        onVoiceStatusChange("searching");

        Promise.resolve(onTranscript(transcript)).finally(() => {
          onVoiceStatusChange("idle");
        });
      }
    };

    recognition.onerror = () => {
      onVoiceStatusChange("idle");
    };

    recognition.onend = () => {
      if (!heardTranscript) {
        onVoiceStatusChange("idle");
      }
    };

    try {
      recognition.start();
    } catch {
      onVoiceStatusChange("idle");
    }
  }

  return (
    <button
      type="button"
      onClick={startVoiceSearch}
      disabled={voiceStatus !== "idle"}
      aria-label={
        voiceStatus === "listening" ? "Listening" : "Search products by voice"
      }
      className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-green-500 p-2 text-white"
    >
      {voiceStatus === "idle" ? (
        <Mic size={15} />
      ) : (
        <Loader2 className="size-[18px] animate-spin" />
      )}
    </button>
  );
}
