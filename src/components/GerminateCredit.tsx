/**
 * Sponsor credit that floats at the bottom-right of the graph on the
 * standalone app. Rendered only when NOT embedded (see App/Warp3D), so it
 * never shows inside a Warp Lessons scene.
 *
 * The sprout mark is a hand-built approximation of the germinate.ai logo —
 * swap `GerminateMark` for the official SVG when it's on hand.
 */
function GerminateMark() {
  return (
    <svg
      className="germinate-mark"
      viewBox="0 0 24 24"
      width="17"
      height="17"
      aria-hidden="true"
    >
      {/* left leaf — smaller, lighter, tip up */}
      <path
        d="M12 20 C9 16, 7 12, 8 7 C11 10, 13 14, 12 20 Z"
        fill="#a5d46a"
      />
      {/* right leaf — larger, leaning right */}
      <path
        d="M12 20 C11 13, 14 8, 21 6 C20 13, 17 18, 12 20 Z"
        fill="#82bd3f"
      />
    </svg>
  );
}

export default function GerminateCredit() {
  return (
    <a
      className="germinate-credit"
      href="https://germinate.ai"
      target="_blank"
      rel="noopener noreferrer"
    >
      <GerminateMark />
      <span>Supported by Germinate.AI</span>
    </a>
  );
}
