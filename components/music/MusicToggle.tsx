"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./MusicToggle.module.css";

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5;

    try {
      await audio.play();
    } catch {
      // Browsers may block audible autoplay until the first interaction.
    }
  }, []);

  useEffect(() => {
    void play();

    const retryAfterInteraction = () => {
      if (audioRef.current?.paused) void play();
    };

    window.addEventListener("pointerdown", retryAfterInteraction, { once: true });
    window.addEventListener("keydown", retryAfterInteraction, { once: true });

    return () => {
      window.removeEventListener("pointerdown", retryAfterInteraction);
      window.removeEventListener("keydown", retryAfterInteraction);
    };
  }, [play]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      void play();
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <audio
        ref={audioRef}
        src="/music.mp3"
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <button
        type="button"
        className={`${styles.toggle} ${isPlaying ? styles.playing : ""}`}
        onClick={toggleMusic}
        aria-label={isPlaying ? "Turn music off" : "Turn music on"}
        aria-pressed={isPlaying}
        title={isPlaying ? "Music on" : "Music off"}
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11 5 6.8 8.5H3.5v7h3.3L11 19V5Z" />
            <path d="M15 9.2a4 4 0 0 1 0 5.6M17.8 6.5a7.8 7.8 0 0 1 0 11" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11 5 6.8 8.5H3.5v7h3.3L11 19V5Z" />
            <path d="m15.5 9 5 6M20.5 9l-5 6" />
          </svg>
        )}
        <span>{isPlaying ? "ON" : "OFF"}</span>
      </button>
    </div>
  );
}
