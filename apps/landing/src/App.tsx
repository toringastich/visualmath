// Working title — rename the brand here (and the <title> in index.html).
const SITE_NAME = "Visual Math";

const GITHUB_URL = "https://github.com/toringastich/visualmath";

type Status = "live" | "building" | "planned";

interface Tool {
  name: string;
  subject: string;
  status: Status;
  description: string;
  href?: string;
}

const TOOLS: Tool[] = [
  {
    name: "Warp",
    subject: "Linear algebra",
    status: "live",
    href: "https://warp.us.com",
    description:
      "Type a matrix and watch it warp space — basis vectors, determinants as areas and volumes, eigenvectors riding the transformation, compositions animating factor by factor. In 2D and 3D.",
  },
  {
    name: "Warp Lessons",
    subject: "Guided walkthroughs",
    status: "building",
    description:
      "Click-through, fully interactive lessons built on Warp — starting with eigenvectors. Read a little, watch the space move, then try it yourself in the sandbox. Summer of Math Exposition 2026 entry.",
  },
  {
    name: "Complex analysis",
    subject: "Future tool",
    status: "planned",
    description:
      "See holomorphic functions warp the complex plane: conformal maps that keep angles honest, Möbius transformations, domain coloring, and the derivative as a local rotate-and-stretch.",
  },
  {
    name: "Vector calculus",
    subject: "Future tool",
    status: "planned",
    description:
      "Fields, flow, and flux in 3D: drag a path through a vector field and watch the line integral accumulate, probe divergence and curl where you point, see the big theorems instead of memorizing them.",
  },
];

const STATUS_LABEL: Record<Status, string> = {
  live: "Live",
  building: "In progress",
  planned: "Planned",
};

/** A sheared grid — the brand motif: straight lines, warped space. */
function HeroGrid() {
  const lines = [];
  for (let i = -10; i <= 26; i++) {
    lines.push(
      <line key={`v${i}`} x1={i * 60} y1={-40} x2={i * 60} y2={400} />,
    );
  }
  for (let j = 0; j <= 8; j++) {
    lines.push(
      <line key={`h${j}`} x1={-600} y1={j * 60} x2={2200} y2={j * 60} />,
    );
  }
  return (
    <svg className="hero-grid" aria-hidden="true">
      <g transform="skewX(-18)">{lines}</g>
    </svg>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const inner = (
    <>
      <div className="card-top">
        <span className="card-subject">{tool.subject}</span>
        <span className={`card-status ${tool.status}`}>
          {STATUS_LABEL[tool.status]}
        </span>
      </div>
      <h2 className="card-name">{tool.name}</h2>
      <p className="card-desc">{tool.description}</p>
      {tool.href && <span className="card-cta">Open →</span>}
    </>
  );
  return tool.href ? (
    <a className="card card-link" href={tool.href}>
      {inner}
    </a>
  ) : (
    <div className="card">{inner}</div>
  );
}

export default function App() {
  return (
    <div className="page">
      <header className="hero">
        <HeroGrid />
        <div className="hero-inner">
          <div className="brand">
            <span className="brand-mark">▦</span>
            <span className="brand-name">{SITE_NAME}</span>
          </div>
          <h1>See what the math does.</h1>
          <p className="hero-sub">
            Free, interactive sandboxes for the math courses where intuition
            goes missing. Type a mathematical object — a matrix, a function, a
            field — and watch it act on space. Runs in your browser: no
            installs, no accounts, nothing to set up.
          </p>
        </div>
      </header>

      <main className="cards">
        {TOOLS.map((t) => (
          <ToolCard key={t.name} tool={t} />
        ))}
      </main>

      <footer className="footer">
        <span>
          Built by Torin Gastich · inspired by the belief that mathematics
          must be visualized
        </span>
        <a href={GITHUB_URL}>GitHub</a>
      </footer>
    </div>
  );
}
