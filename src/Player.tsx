import { useState } from "react";
import { WARP_URL, type Lesson } from "./lessons";

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

        <h2>{step.title}</h2>
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
