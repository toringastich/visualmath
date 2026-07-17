import { useEffect, useRef, useState, type ReactNode } from "react";

const TTS_AVAILABLE = "speechSynthesis" in window;

/**
 * The article page frame: masthead, title block, reading column, footer.
 * The Listen button plays a recorded narration when `audioUrl` is set;
 * otherwise it reads the article text with the browser's built-in TTS,
 * paragraph by paragraph (long single utterances get cut off in some
 * browsers).
 */
export default function ArticleShell({
  title,
  subtitle,
  date,
  audioUrl,
  children,
}: {
  title: string;
  subtitle: string;
  date: string;
  audioUrl?: string;
  children: ReactNode;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const stop = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    if (TTS_AVAILABLE) speechSynthesis.cancel();
    setPlaying(false);
  };
  useEffect(() => stop, []);

  const toggle = () => {
    if (playing) {
      stop();
      return;
    }
    if (audioUrl) {
      const a = new Audio(audioUrl);
      audioRef.current = a;
      a.onended = () => setPlaying(false);
      a.onerror = () => setPlaying(false);
      void a.play();
      setPlaying(true);
      return;
    }
    if (!TTS_AVAILABLE || !bodyRef.current) return;
    const blocks = Array.from(
      bodyRef.current.querySelectorAll("p, h2, h3, figcaption span"),
    )
      .map((el) => (el as HTMLElement).innerText.trim())
      .filter(Boolean);
    speechSynthesis.cancel();
    blocks.forEach((text, k) => {
      const u = new SpeechSynthesisUtterance(text);
      if (k === blocks.length - 1) u.onend = () => setPlaying(false);
      u.onerror = () => setPlaying(false);
      speechSynthesis.speak(u); // queues behind the previous utterance
    });
    setPlaying(true);
  };

  const base = import.meta.env.BASE_URL;
  return (
    <div className="article-page">
      <header className="masthead">
        <a className="brand" href={base}>
          <span className="brand-mark">▦</span>
          <span className="brand-name">Warp Lessons</span>
        </a>
        <a className="masthead-link" href="https://warp.us.com">
          Open the sandbox →
        </a>
      </header>

      <article className="article">
        <header className="article-head">
          <h1>{title}</h1>
          <p className="article-subtitle">{subtitle}</p>
          <div className="article-meta">
            <span>Torin Gastich · {date}</span>
            {(audioUrl || TTS_AVAILABLE) && (
              <button
                className={"listen-btn" + (playing ? " on" : "")}
                title={playing ? "Stop narration" : "Listen to this article"}
                onClick={toggle}
              >
                {playing ? "◼ Stop" : "▶ Listen"}
              </button>
            )}
          </div>
        </header>
        <div className="article-body" ref={bodyRef}>
          {children}
        </div>
      </article>

      <footer className="article-footer">
        <a href={base}>← All lessons</a>
        <span>
          Built on <a href="https://warp.us.com">Warp</a> · free, no accounts
        </span>
      </footer>
    </div>
  );
}
