/**
 * Warp's telemetry layer.
 *
 * Product code never talks to Google (or to any vendor) directly — it names an
 * event and hands over a flat bag of parameters. Where that goes is decided
 * here, by a list of independent *sinks*:
 *
 *   site     warp.us.com's own GA4 property. Top-level pages only, never on
 *            localhost — an embed's traffic isn't ours and dev work isn't
 *            anyone's.
 *   host     Embeds postMessage every event up to the page that framed them,
 *            so a site hosting Warp can feed its own analytics without Warp
 *            knowing a thing about their stack.
 *   partner  An embed can also name its own GA4 property outright with
 *            ?ga=G-XXXXXXXXXX and have events mirrored straight into it.
 *   console  ?debug_telemetry=1 (and localhost, where nothing is sent
 *            anywhere) prints each event instead.
 *
 * So: a new destination is a new sink, and a new event is a track() call.
 * Nothing in the app has to change for either.
 */
import {
  GA_MEASUREMENT_ID,
  TELEMETRY_EVENT_BUDGET,
  TELEMETRY_SAMPLE_RATE,
} from "./config";

export type ParamValue = string | number | boolean;
export type EventParams = Record<string, ParamValue | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type Sink = (name: string, params: EventParams) => void;

const BROWSER = typeof window !== "undefined";
const EMBEDDED = BROWSER && window.self !== window.top;
const LOCAL =
  BROWSER && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

/** GA4 hard limits — over them, values are dropped rather than truncated. */
const MAX_NAME = 40;
const MAX_VALUE = 100;
const MAX_PARAMS = 25;

const sinks: Sink[] = [];
let started = false;
/** ?debug_telemetry=1 — log locally *and* route events to GA's DebugView. */
let debug = false;

// --- Volume control ---------------------------------------------------------
//
// Two independent brakes, both decided per page load:
//
//   sampled   whether this visit reports custom events at all
//   spent     how many it has reported so far, against a hard budget
//
// Neither touches pageviews. gtag("config") sends page_view directly and is
// deliberately outside all of this — a launch is measured in pageviews, and
// they're the cheapest thing GA stores.

let sampled = true;
let spent = 0;

// --- gtag bootstrap ---------------------------------------------------------

const configured = new Set<string>();

/** Load gtag.js once, then register `id` as one more destination on it. */
function configure(id: string): void {
  window.dataLayer = window.dataLayer ?? [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());

    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(s);
  }
  if (configured.has(id)) return;
  configured.add(id);
  window.gtag("config", id);
}

/**
 * Events always name their destination. Without `send_to`, gtag fans every
 * event out to *every* configured property — which would leak Warp's traffic
 * into a partner's numbers and vice versa.
 */
function gaSink(id: string): Sink {
  return (name, params) =>
    window.gtag?.("event", name, {
      ...params,
      send_to: id,
      ...(debug ? { debug_mode: true } : {}),
    });
}

// --- Public API -------------------------------------------------------------

/**
 * Wire up the sinks. Called once at startup from main.tsx, outside React so
 * StrictMode's double-invoke can't double-count anything.
 */
export function initTelemetry(): void {
  if (!BROWSER || started) return;
  started = true;

  const query = new URLSearchParams(location.search);
  debug = query.has("debug_telemetry");

  // Debugging a sampled-out session would be maddening, so debug always wins.
  sampled = debug || TELEMETRY_SAMPLE_RATE >= 1 || Math.random() < TELEMETRY_SAMPLE_RATE;

  if (LOCAL || debug) {
    sinks.push((name, params) => console.info("[warp:telemetry]", name, params));
  }

  if (!EMBEDDED && !LOCAL) {
    configure(GA_MEASUREMENT_ID);
    sinks.push(gaSink(GA_MEASUREMENT_ID));
  }

  // An embed reports upward instead of sideways: the host page owns its own
  // data and decides what to do with it. targetOrigin is "*" because the
  // recipient *is* whoever embedded us — same as the existing "warp:ready".
  if (EMBEDDED) {
    sinks.push((name, params) => {
      window.parent?.postMessage(
        { source: "warp", type: "event", name, params },
        "*",
      );
    });
  }

  const partner = query.get("ga");
  if (partner && /^G-[A-Z0-9]{4,20}$/.test(partner) && !LOCAL) {
    configure(partner);
    sinks.push(gaSink(partner));
  }
}

const fired = new Set<string>();

/**
 * A milestone: the first time this visit does something, and never again.
 *
 * Activation events answer "how far did people get", which is a question
 * about visits, not about clicks — someone who plays a warp thirty times is
 * one activated visitor. Collapsing that here rather than in reporting also
 * keeps the funnel's cost flat: a handful of events per session, no matter
 * how long or how enthusiastically someone plays.
 */
export function trackOnce(name: string, params: EventParams = {}): void {
  if (fired.has(name)) return;
  fired.add(name);
  track(name, params);
}

/** Trim to what GA4 will actually accept, dropping empties along the way. */
function clean(params: EventParams): EventParams {
  const out: EventParams = {};
  let n = 0;
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    if (n++ >= MAX_PARAMS) break;
    out[key.slice(0, MAX_NAME)] =
      typeof value === "string" ? value.slice(0, MAX_VALUE) : value;
  }
  return out;
}

/**
 * Record one event. Every event carries `surface`, so site traffic and embed
 * traffic stay separable in whichever property they land in.
 */
export function track(name: string, params: EventParams = {}): void {
  if (!started || sinks.length === 0 || !sampled) return;

  // At the ceiling, spend the last slot saying so — a silent cap would read as
  // quiet users — then stay quiet for the rest of the page load.
  if (spent >= TELEMETRY_EVENT_BUDGET) return;
  spent += 1;
  const capped = spent === TELEMETRY_EVENT_BUDGET;

  const payload = clean(
    capped
      ? { surface: EMBEDDED ? "embed" : "site", dropped_event: name }
      : { surface: EMBEDDED ? "embed" : "site", ...params },
  );
  const event = (capped ? "telemetry_budget_reached" : name).slice(0, MAX_NAME);
  for (const sink of sinks) {
    try {
      sink(event, payload);
    } catch {
      // Telemetry never breaks the sandbox.
    }
  }
}
