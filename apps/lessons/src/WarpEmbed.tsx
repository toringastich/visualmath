import { useEffect, useRef, useState } from "react";
import { WARP_URL } from "./states";

/**
 * A live Warp scene embedded in article prose. Loads lazily — the iframe
 * mounts only as the reader approaches it, so an article with several
 * embeds doesn't boot several sandboxes up front.
 *
 * Once the scene is fully in view, it auto-plays its animation once, so the
 * embed reads as live rather than as a static picture. This is a handshake:
 * Warp posts `warp:ready` when it has mounted; we post `warp:autoplay` back
 * as soon as it's both ready and fully visible.
 */
export default function WarpEmbed({
  state,
  caption,
  height = 460,
  tutorial = false,
  zoom,
}: {
  /** Warp share-link payload (the part after `#s=`). */
  state: string;
  /** One-line caption; shows under the scene with an open-in-Warp link. */
  caption?: string;
  height?: number;
  /** Keep the Tutorial button in this embed (e.g. the closing sandbox). */
  tutorial?: boolean;
  /**
   * 3D only: multiplier on the default camera distance. The sandbox opens wide
   * enough to show the whole xyz frame; an embed teaching one shape wants to
   * sit closer (e.g. 0.6).
   */
  zoom?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [visible, setVisible] = useState(false);

  // Lazy mount: bring the iframe in a little before it enters the viewport.
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

  // Auto-play once the scene is fully on screen. `ready` (Warp mounted) and
  // `armed` (fully visible) can arrive in either order; play when both hold.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ready = false;
    let armed = false;
    let played = false;

    const tryPlay = () => {
      if (played || !ready || !armed) return;
      played = true;
      iframeRef.current?.contentWindow?.postMessage("warp:autoplay", WARP_URL);
    };

    const onMessage = (e: MessageEvent) => {
      if (e.origin === WARP_URL && e.data === "warp:ready") {
        ready = true;
        tryPlay();
      }
    };
    window.addEventListener("message", onMessage);

    const obs = new IntersectionObserver(
      ([entry]) => {
        const rb = entry.rootBounds;
        if (!rb) return;
        // Fire when the whole embed is visible; for an embed taller than the
        // viewport (small screens), a solid majority counts as "fully seen".
        const need = entry.boundingClientRect.height > rb.height ? 0.5 : 0.9;
        if (entry.intersectionRatio >= need) {
          armed = true;
          tryPlay();
        }
      },
      { threshold: [0.5, 0.9, 1] },
    );
    obs.observe(el);

    return () => {
      window.removeEventListener("message", onMessage);
      obs.disconnect();
    };
  }, []);

  const params = new URLSearchParams();
  if (tutorial) params.set("tutorial", "1");
  if (zoom) params.set("zoom", String(zoom));
  const qs = params.toString();
  const url = `${WARP_URL}/${qs ? `?${qs}` : ""}#s=${state}`;
  return (
    <figure className="embed" ref={ref}>
      <div className="embed-stage" style={{ height }}>
        {visible ? (
          <iframe
            ref={iframeRef}
            className="embed-frame"
            src={url}
            title={caption ?? "Warp scene"}
          />
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
