/** Shared display formatting for numbers and engine values. */
import { type Value } from "@vm/engine/expr";
import * as P from "@vm/engine/poly";

export function fmt(n: number): string {
  const r = Math.round(n * 1e6) / 1e6;
  return Object.is(r, -0) ? "0" : String(r);
}

/**
 * Rounder display for eigen/svd output, where the values are usually
 * irrational and six decimals would be noise.
 */
export function fmt3(n: number): string {
  const r = Math.round(n * 1e3) / 1e3;
  return Object.is(r, -0) ? "0" : String(r);
}

/** Subscript digits, for λ₁ / σ₂ style labels. */
export const SUBS = ["₁", "₂", "₃"];

/** An angle in radians as degrees to one decimal ("36.9°"). */
export function degrees(rad: number): string {
  const d = Math.round(((rad * 180) / Math.PI) * 10) / 10;
  return `${Object.is(d, -0) ? 0 : d}°`;
}

/** A polynomial as display text ("2x³ + 3xy²"; plain number when constant). */
export function polyText(p: P.Poly): string {
  return P.toText(p, fmt);
}

export function valueToText(v: Value): string {
  switch (v.kind) {
    case "del":
      return "∇ — use dot(del, F) or cross(del, F)";
    case "scalar":
      return polyText(v.value);
    case "vector":
      return `(${polyText(v.value.x)}, ${polyText(v.value.y)})`;
    case "vector3":
      return `(${polyText(v.value.x)}, ${polyText(v.value.y)}, ${polyText(v.value.z)})`;
    case "matrix": {
      const t = v.value.map(polyText);
      // Symbolic entries can contain spaces, so separate with commas then.
      const sep = v.value.every(P.isConst) ? " " : ", ";
      return `[${t[0]}${sep}${t[1]}; ${t[2]}${sep}${t[3]}]`;
    }
    case "matrix3": {
      const t = v.value.map(polyText);
      const sep = v.value.every(P.isConst) ? " " : ", ";
      const row = (r: number) => `${t[r]}${sep}${t[r + 1]}${sep}${t[r + 2]}`;
      return `[${row(0)}; ${row(3)}; ${row(6)}]`;
    }
  }
}
