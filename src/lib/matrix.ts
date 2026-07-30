/**
 * Pure 2x2 linear-algebra helpers.
 *
 * This module knows nothing about Canvas, React, or the DOM — it only
 * transforms numbers. Keeping the math isolated like this is what lets the
 * 3D phase layer Three.js on top later without touching any of it.
 *
 * A matrix is stored row-major as [a, b, c, d], meaning:
 *     | a  b |
 *     | c  d |
 * Its columns are where the basis vectors land:
 *     i-hat (1,0) -> (a, c)
 *     j-hat (0,1) -> (b, d)
 */

export type Mat2 = readonly [number, number, number, number];
export interface Vec2 {
  x: number;
  y: number;
}

export const IDENTITY: Mat2 = [1, 0, 0, 1];

/** det = ad - bc. Signed area scale factor; sign encodes orientation. */
export function det(m: Mat2): number {
  return m[0] * m[3] - m[1] * m[2];
}

/** Apply the matrix to a vector: M * v. */
export function apply(m: Mat2, v: Vec2): Vec2 {
  return {
    x: m[0] * v.x + m[1] * v.y,
    y: m[2] * v.x + m[3] * v.y,
  };
}

/** First column — where i-hat lands. */
export function iHat(m: Mat2): Vec2 {
  return { x: m[0], y: m[2] };
}

/** Second column — where j-hat lands. */
export function jHat(m: Mat2): Vec2 {
  return { x: m[1], y: m[3] };
}

/** Transpose: rows become columns. */
export function transpose(m: Mat2): Mat2 {
  return [m[0], m[2], m[1], m[3]];
}

/** Matrix product M * N. */
export function multiply(m: Mat2, n: Mat2): Mat2 {
  return [
    m[0] * n[0] + m[1] * n[2],
    m[0] * n[1] + m[1] * n[3],
    m[2] * n[0] + m[3] * n[2],
    m[2] * n[1] + m[3] * n[3],
  ];
}

/** Inverse, or null if the matrix is singular (det ~ 0). */
export function inverse(m: Mat2): Mat2 | null {
  const d = det(m);
  if (Math.abs(d) < 1e-12) return null;
  return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d];
}

export type Eigen =
  | { kind: "complex"; re: number; im: number }
  | { kind: "uniform"; value: number } // M = λI: every vector is an eigenvector
  | { kind: "real"; pairs: { value: number; vec: Vec2 }[]; repeated: boolean };

/**
 * Eigenvalues + eigenvectors of a 2x2 matrix via the characteristic
 * polynomial. Eigenvectors are unit length with a canonical sign
 * (positive x, or positive y when x ~ 0).
 */
export function eigen(m: Mat2): Eigen {
  const [a, b, c, d] = m;
  const tr = a + d;
  const dt = det(m);
  const scale = Math.max(1, Math.abs(a), Math.abs(b), Math.abs(c), Math.abs(d));
  const eps = 1e-9 * scale * scale;
  const disc = tr * tr - 4 * dt;
  if (disc < -eps) return { kind: "complex", re: tr / 2, im: Math.sqrt(-disc) / 2 };

  const unit = (v: Vec2): Vec2 | null => {
    const len = Math.hypot(v.x, v.y);
    if (len < 1e-12) return null;
    let u = { x: v.x / len, y: v.y / len };
    if (u.x < -1e-9 || (Math.abs(u.x) <= 1e-9 && u.y < 0)) u = { x: -u.x, y: -u.y };
    return u;
  };
  // Null space of (M - λI): read a vector off whichever row is better
  // conditioned; both rows ~ zero means M = λI.
  const vecFor = (l: number): Vec2 | null => {
    const r1 = Math.hypot(a - l, b);
    const r2 = Math.hypot(c, d - l);
    if (r1 < 1e-9 * scale && r2 < 1e-9 * scale) return null;
    return r1 >= r2 ? unit({ x: b, y: l - a }) : unit({ x: l - d, y: c });
  };

  const s = Math.sqrt(Math.max(disc, 0));
  const l1 = (tr + s) / 2;
  const l2 = (tr - s) / 2;

  if (disc <= eps) {
    const v = vecFor(l1);
    if (!v) return { kind: "uniform", value: l1 };
    return { kind: "real", pairs: [{ value: l1, vec: v }], repeated: true };
  }
  const pairs: { value: number; vec: Vec2 }[] = [];
  for (const l of [l1, l2]) {
    const v = vecFor(l);
    pairs.push({ value: l, vec: v ?? { x: 1, y: 0 } });
  }
  return { kind: "real", pairs, repeated: false };
}

export interface Svd2 {
  /** Singular values, largest first. Both are >= 0. */
  sigma: [number, number];
  /**
   * Right singular vectors: the two perpendicular *input* directions, unit
   * length. v[i] is the direction that gets stretched by sigma[i].
   */
  v: [Vec2, Vec2];
  /**
   * Left singular vectors: the *output* directions, unit length. M maps v[i]
   * to sigma[i] * u[i], so these are the axes of the image ellipse.
   */
  u: [Vec2, Vec2];
  /** The three factors of M = U * S * Vᵀ, as matrices. */
  uMat: Mat2;
  sMat: Mat2;
  vMat: Mat2;
  /** Rotation angle of V, and of U's first column, in radians. */
  vAngle: number;
  uAngle: number;
  /** U reverses orientation (det U < 0) — equivalently, det M < 0. */
  flipped: boolean;
}

/**
 * Singular value decomposition of a 2x2 matrix: M = U * diag(σ₁, σ₂) * Vᵀ,
 * with U and V orthogonal and σ₁ >= σ₂ >= 0.
 *
 * Geometrically this is the statement that *every* matrix is a rotation, then
 * an axis-aligned stretch, then another rotation — so every matrix carries the
 * unit circle onto an ellipse whose semi-axes are σ₁ and σ₂.
 *
 * Computed from the eigen-decomposition of the symmetric MᵀM (whose
 * eigenvalues are the σ², and whose eigenvectors are the columns of V), then
 * u_i = M v_i / σ_i. Among the sign choices, we always take the one making V a
 * pure rotation (det V = +1); that pins all the orientation reversal onto U,
 * where `flipped` reports it.
 */
export function svd(m: Mat2): Svd2 {
  const [a, b, c, d] = m;
  const scale = Math.max(1, Math.abs(a), Math.abs(b), Math.abs(c), Math.abs(d));

  // MᵀM = [p q; q r] — symmetric, so its eigenvectors are perpendicular.
  const p = a * a + c * c;
  const q = a * b + c * d;
  const r = b * b + d * d;
  const mid = (p + r) / 2;
  const dif = (p - r) / 2;
  const rad = Math.hypot(dif, q);
  const eps = 1e-12 * scale * scale;

  // σ₁ comes from the larger eigenvalue, where mid + rad can't cancel.
  //
  // σ₂ does NOT come from the smaller one: mid − rad loses most of its digits
  // for a lopsided matrix (for [1e-7 0; 0 5] it cancels to noise, and the
  // square root doubles the relative error). Since σ₁σ₂ = |det M| exactly, the
  // determinant gives σ₂ to full precision instead.
  const s1 = Math.sqrt(Math.max(0, mid + rad));
  const dt = det(m);
  const sigma: [number, number] = [s1, s1 > 0 ? Math.abs(dt) / s1 : 0];

  // Eigenvector for l1. When rad ~ 0, MᵀM is a multiple of the identity (M is
  // a scaled rotation or reflection) and every direction stretches equally, so
  // any orthonormal pair will do.
  let v1: Vec2;
  if (rad <= eps) {
    v1 = { x: 1, y: 0 };
  } else if (Math.abs(q) > eps) {
    // (λ₁ − r, q) solves the second row of (MᵀM − λ₁I)v = 0.
    const l1 = mid + rad;
    const len = Math.hypot(l1 - r, q);
    v1 = { x: (l1 - r) / len, y: q / len };
  } else {
    // Already diagonal: the axes themselves, in the order that puts the
    // bigger stretch first.
    v1 = p >= r ? { x: 1, y: 0 } : { x: 0, y: 1 };
  }
  // Canonical sign, matching eigen(): point right, or up when vertical.
  if (v1.x < -1e-9 || (Math.abs(v1.x) <= 1e-9 && v1.y < 0))
    v1 = { x: -v1.x, y: -v1.y };
  // The perpendicular, chosen so that det [v1 v2] = +1: V is a pure rotation.
  const v2: Vec2 = { x: -v1.y, y: v1.x };

  // u₁ is the direction M v₁ points (normalized rather than divided by σ₁, so
  // it comes out exactly unit length whatever the conditioning). M = 0 leaves
  // it free.
  const w1 = apply(m, v1);
  const w1len = Math.hypot(w1.x, w1.y);
  const u1: Vec2 =
    w1len > 1e-300 ? { x: w1.x / w1len, y: w1.y / w1len } : { x: 1, y: 0 };
  // u₂ is forced: U is orthogonal, so it's ±perp(u₁), and since det V = +1 and
  // the σ are non-negative, det U carries the sign of det M. Building it this
  // way keeps U exactly orthonormal — dividing M v₂ by a near-zero σ₂ would
  // not. A singular M leaves the sign free; +1 is as good as any.
  const perp: Vec2 = { x: -u1.y, y: u1.x };
  const u2: Vec2 = dt < 0 ? { x: -perp.x, y: -perp.y } : perp;

  const uMat: Mat2 = [u1.x, u2.x, u1.y, u2.y];
  const sMat: Mat2 = [sigma[0], 0, 0, sigma[1]];
  const vMat: Mat2 = [v1.x, v2.x, v1.y, v2.y];

  return {
    sigma,
    v: [v1, v2],
    u: [u1, u2],
    uMat,
    sMat,
    vMat,
    vAngle: Math.atan2(v1.y, v1.x),
    uAngle: Math.atan2(u1.y, u1.x),
    flipped: det(uMat) < 0,
  };
}

/** Per-entry linear interpolation from `from` to `to` at t in [0, 1]. */
export function lerp(from: Mat2, to: Mat2, t: number): Mat2 {
  return [
    from[0] + (to[0] - from[0]) * t,
    from[1] + (to[1] - from[1]) * t,
    from[2] + (to[2] - from[2]) * t,
    from[3] + (to[3] - from[3]) * t,
  ];
}
