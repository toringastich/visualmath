import { useEffect, useRef, useState } from "react";
import { WARP_URL } from "./states";

/**
 * A live Warp scene embedded in article prose. Loads lazily — the iframe
 * mounts only as the reader approaches it, so an article with several
 * embeds doesn't boot several sandboxes up front.
 */
export default function WarpEmbed({
  state,
  caption,
  height = 460,
}: {
  /** Warp share-link payload (the part after `#s=`). */
  state: string;
  /** One-line caption; shows under the scene with an open-in-Warp link. */
  caption?: string;
  height?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "500px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const url = `${WARP_URL}/#s=${state}`;
  return (
    <figure className="embed" ref={ref}>
      <div className="embed-stage" style={{ height }}>
        {visible ? (
          <iframe className="embed-frame" src={url} title={caption ?? "Warp scene"} />
        ) : (
          <div className="embed-placeholder">
            <span className="embed-placeholder-mark">▦</span>
          </div>
        )}
      </div>
      <figcaption className="embed-caption">
        <span>{caption}</span>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Open in Warp ↗
        </a>
      </figcaption>
    </figure>
  );
}
