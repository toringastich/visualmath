import { ARTICLES } from "./articles/index";

export default function App() {
  const base = import.meta.env.BASE_URL;
  return (
    <div className="home">
      <header className="home-hero">
        <div className="brand">
          <span className="brand-mark">▦</span>
          <span className="brand-name">Warp Lessons</span>
        </div>
        <h1>Interactive articles, built on Warp.</h1>
        <p className="home-sub">
          Read a little, watch space move, then try it yourself. Every scene
          is live — the same sandbox as{" "}
          <a href="https://warp.us.com">warp.us.com</a>, one idea at a time.
        </p>
      </header>
      <main className="lesson-list">
        {ARTICLES.map((a) => (
          <a key={a.slug} className="lesson-card" href={base + a.slug + "/"}>
            <div className="lesson-card-top">
              <span className="lesson-card-count">{a.date}</span>
              {a.status === "draft" && (
                <span className="lesson-card-draft">Draft</span>
              )}
            </div>
            <h2>{a.title}</h2>
            <p>{a.subtitle}</p>
          </a>
        ))}
      </main>
      <footer className="home-footer">
        <span>Part of the Warp family · free, no accounts, runs in your browser</span>
        <a href="https://github.com/toringastich/warp-lessons">GitHub</a>
      </footer>
    </div>
  );
}
