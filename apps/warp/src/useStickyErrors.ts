/**
 * The "stuck error" signal.
 *
 * A red message under a row is normal — half of it is just the parser talking
 * mid-keystroke, and it clears itself on the next character. What's worth
 * knowing is when someone types, *stops*, and the error is still sitting there:
 * they meant that expression to work and Warp disagreed. Five seconds of quiet
 * with an error on screen is the closest thing to someone raising their hand.
 *
 * That makes this an improvement pipeline that doesn't need anyone to fill in
 * the Feedback form — every stuck error is a place the syntax, the message, or
 * the docs failed somebody.
 */
import { useEffect, useRef } from "react";
import { track } from "./analytics";
import type { Mode, Row, RowId, RowResult } from "./rows";

/** Quiet time after the last keystroke before an error counts as stuck. */
const STICKY_MS = 5000;

/** What the user actually typed into a row. */
function sourceOf(row: Row): string {
  return row.kind === "expr" ? row.src : `${row.name} = ${row.cells.join(", ")}`;
}

/**
 * Error text is a small fixed vocabulary (~35 messages), which makes it a good
 * GA4 dimension as-is — except where a message quotes the user's own name back
 * at them. Folding those to a placeholder keeps the cardinality flat, and the
 * name is still there in `expression` if it ever matters.
 */
function normalizeMessage(message: string): string {
  return message.replace(/"[^"]*"/g, '"…"');
}

/**
 * Fire `expression_error_stuck` for each row still showing an error five
 * seconds after typing stops. Call once per sandbox, alongside the results it
 * already computes.
 */
export function useStickyErrors(
  mode: Mode,
  rows: Row[],
  results: Map<RowId, RowResult>,
): void {
  // Read through to the current scene when the timer finally fires, rather
  // than re-arming it on every unrelated render.
  const latest = useRef({ rows, results });
  latest.current = { rows, results };

  // Once per (expression, error) per session — a user fighting the same typo
  // for a minute is one data point, not twelve.
  const reported = useRef(new Set<string>());

  // Changes on exactly one thing: a keystroke.
  const typed = rows.map(sourceOf).join("");

  // State restored from a URL or localStorage wasn't typed by this person, so
  // a shared link that happens to contain an error shouldn't report one.
  const initial = useRef(typed);

  useEffect(() => {
    if (typed === initial.current) return;

    const timer = window.setTimeout(() => {
      const scene = latest.current;
      for (const row of scene.rows) {
        const error = scene.results.get(row.id)?.error;
        if (!error) continue;

        const expression = sourceOf(row).trim();
        if (!expression) continue;

        const key = `${mode}|${expression}|${error}`;
        if (reported.current.has(key)) continue;
        reported.current.add(key);

        track("expression_error_stuck", {
          error_message: normalizeMessage(error),
          expression,
          row_kind: row.kind,
          warp_mode: mode,
        });
      }
    }, STICKY_MS);

    return () => window.clearTimeout(timer);
  }, [typed, mode]);
}
