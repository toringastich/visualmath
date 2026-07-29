/** warp.us.com's GA4 property. Loaded and gated by src/analytics.ts. */
export const GA_MEASUREMENT_ID = "G-KSXRQBEMD9";

/**
 * Fraction of page loads whose *custom events* are recorded. Pageviews are
 * never sampled — they're the cheap number and the one a launch is judged on.
 *
 * 1 is right until Warp is doing serious traffic. If an HN or Reddit spike
 * ever makes the event volume uncomfortable, drop this (0.25, 0.1) and deploy;
 * the shape of every funnel and error ranking survives sampling, only the
 * absolute counts shrink. The die is cast once per page load, not per event,
 * so a sampled-in visit reports its whole story rather than a third of it.
 */
export const TELEMETRY_SAMPLE_RATE = 1;

/**
 * Hard ceiling on custom events per page load. Nothing today comes close —
 * it exists so that a bug, a pathological session, or a scripted client can't
 * turn into unbounded volume. Worst case is now visitors x this, not infinity.
 */
export const TELEMETRY_EVENT_BUDGET = 40;

/** Where the floating Feedback button points (Google Form -> Sheet). */
export const FEEDBACK_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSefVUq7YqCi0UoJetDCnbdD-HuDWf8xdhAXw1tHhClZKev4fw/viewform";
