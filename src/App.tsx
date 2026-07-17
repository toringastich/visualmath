import { useState } from "react";
import { LESSONS, type Lesson } from "./lessons";
import Player from "./Player";

export default function App() {
  const [active, setActive] = useState<Lesson | null>(null);

  if (active) return <Player lesson={active} onExit={() => setActive(null)} />;

  return (
    <div className="home">
      <header className="home-hero">
        <div className="brand">
          <span className="brand-mark">▦</span>
          <span className="brand-name">Warp Lessons</span>
        </div>
        <h1>Interactive walkthroughs, built on Warp.</h1>
        <p className="home-sub">
          Read a little, watch space move, then try it yourself. Every scene
          is live — the same sandbox as{" "}
          <a href="https://warp.us.com">warp.us.com</a>, one idea at a time.
        </p>
      </header>
      <main className="lesson-list">
        {LESSONS.map((l) => (
          <button key={l.slug} className="lesson-card" onClick={() => setActive(l)}>
            <div className="lesson-card-top">
              <span className="lesson-card-count">
                {l.steps.length} steps
              </span>
              {l.status === "draft" && (
                <span className="lesson-card-draft">Draft</span>
              )}
            </div>
            <h2>{l.title}</h2>
            <p>{l.subtitle}</p>
          </button>
        ))}
      </main>
      <footer className="home-footer">
        <span>Part of the Warp family · free, no accounts, runs in your browser</span>
        <a href="https://github.com/toringastich/warp-lessons">GitHub</a>
      </footer>
    </div>
  );
}
