import { useEffect, useRef, useState } from "react";
import { WARP_URL, type Lesson, type LessonStep } from "./lessons";

const TTS_AVAILABLE = "speechSynthesis" in window;

/**
 * Spoken narration for a step: plays the step's recorded audio when it has
 * one, otherwise reads the step text with the browser's built-in TTS.
 * Anything playing stops when the step changes.
 */
function useNarration(step: LessonStep, stepIndex: number) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    if (TTS_AVAILABLE) speechSynthesis.cancel();
    setPlaying(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => stop, [stepIndex]);

  const toggle = () => {
    if (playing) {
      stop();
      return;
    }
    if (step.audio) {
      const a = new Audio(step.audio);
      audioRef.current = a;
      a.onended = () => setPlaying(false);
      a.onerror = () => setPlaying(false);
      void a.play();
      setPlaying(true);
      return;
    }
    if (!TTS_AVAILABLE) return;
    const text = [
      step.title,
      ...step.body,
      step.tryThis ? `Try it: ${step.tryThis}` : "",
    ].join(" ");
    const u = new SpeechSynthesisUtterance(text);
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
    setPlaying(true);
  };

  return { playing, toggle, available: Boolean(step.audio) || TTS_AVAILABLE };
}

/**
 * The lesson player: text panel on the left, a live embedded Warp scene on
 * the right. Scenes load via the sandbox's own URL-hash format; the iframe
 * is keyed by step so a hash-only change still remounts (Warp reads its
 * hash once, on load).
 */
export default function Player({
  lesson,
  onExit,
}: {
  lesson: Lesson;
  onExit: () => void;
}) {
  const [i, setI] = useState(0);
  const step = lesson.steps[i];
  const last = i === lesson.steps.length - 1;
  const sceneUrl = step.state ? `${WARP_URL}/#s=${step.state}` : null;
  const narration = useNarration(step, i);

  return (
    <div className="player">
      <aside className="lesson-panel">
        <button className="back-link" onClick={onExit}>
          ← All lessons
        </button>
        <div className="lesson-heading">
          <h1>{lesson.title}</h1>
          <span className="lesson-progress">
            {i + 1} / {lesson.steps.length}
          </span>
        </div>

        <div className="step-heading">
          <h2>{step.title}</h2>
          {narration.available && (
            <button
              className={"listen-btn" + (narration.playing ? " on" : "")}
              title={narration.playing ? "Stop narration" : "Listen to this step"}
              onClick={narration.toggle}
            >
              {narration.playing ? "◼ Stop" : "▶ Listen"}
            </button>
          )}
        </div>
        {step.body.map((p, k) => (
          <p key={k}>{p}</p>
        ))}
        {step.tryThis && (
          <p className="try-this">
            <strong>Try it:</strong> {step.tryThis}
          </p>
        )}

        <div className="step-nav">
          <button
            className="step-btn ghost"
            disabled={i === 0}
            onClick={() => setI(i - 1)}
          >
            Back
          </button>
          <div className="step-dots">
            {lesson.steps.map((_, k) => (
              <button
                key={k}
                className={"step-dot" + (k === i ? " on" : "")}
                aria-label={`Step ${k + 1}`}
                onClick={() => setI(k)}
              />
            ))}
          </div>
          {last ? (
            <a className="step-btn primary" href={WARP_URL}>
              Open Warp →
            </a>
          ) : (
            <button className="step-btn primary" onClick={() => setI(i + 1)}>
              Next
            </button>
          )}
        </div>
      </aside>

      <main className="scene">
        {sceneUrl ? (
          <>
            <iframe
              key={i}
              className="scene-frame"
              src={sceneUrl}
              title={`Warp scene: ${step.title}`}
            />
            <a className="scene-open" href={sceneUrl} target="_blank" rel="noopener noreferrer">
              Open in Warp ↗
            </a>
          </>
        ) : (
          <a className="scene-cta" href={WARP_URL}>
            <span className="scene-cta-mark">▦</span>
            <span>Open the Warp sandbox →</span>
          </a>
        )}
      </main>
    </div>
  );
}
