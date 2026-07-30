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
      {/* Rebranded copy and the monorepo link go live only with the post-Aug-30
          cutover — the judged article is served from the standalone repo, whose
          copy of this file is deliberately left alone until then. */}
      <footer className="home-footer">
        <span>
          A <a href="https://secantlabs.org">Secant Labs</a> project · free, no
          accounts, runs in your browser
        </span>
        <a href="https://github.com/secantlabs/visualmath">GitHub</a>
      </footer>
    </div>
  );
}
