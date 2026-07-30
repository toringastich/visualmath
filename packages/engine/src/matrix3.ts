/**
 * Pure 3x3 linear-algebra helpers — the 3D counterpart of matrix.ts.
 *
 * Like matrix.ts, this knows nothing about rendering. A matrix is stored
 * row-major as [a, b, c, d, e, f, g, h, i], meaning:
 *     | a  b  c |
 *     | d  e  f |
 *     | g  h  i |
 * Its columns are where the basis vectors land:
 *     i-hat (1,0,0) -> (a, d, g)
 *     j-hat (0,1,0) -> (b, e, h)
 *     k-hat (0,0,1) -> (c, f, i)
 */

export type Mat3 = readonly [
  number, number, number,
  number, number, number,
  number, number, number,
];
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export const IDENTITY3: Mat3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];

/** det = signed volume scale factor; sign encodes orientation. */
export function det3(m: Mat3): number {
  return (
    m[0] * (m[4] * m[8] - m[5] * m[7]) -
    m[1] * (m[3] * m[8] - m[5] * m[6]) +
    m[2] * (m[3] * m[7] - m[4] * m[6])
  );
}

/** Apply the matrix to a vector: M * v. */
export function apply3(m: Mat3, v: Vec3): Vec3 {
  return {
    x: m[0] * v.x + m[1] * v.y + m[2] * v.z,
    y: m[3] * v.x + m[4] * v.y + m[5] * v.z,
    z: m[6] * v.x + m[7] * v.y + m[8] * v.z,
  };
}

/** Column n (0..2) — where the nth basis vector lands. */
export function col3(m: Mat3, n: 0 | 1 | 2): Vec3 {
  return { x: m[n], y: m[3 + n], z: m[6 + n] };
}

/** Matrix product M * N. */
export function multiply3(m: Mat3, n: Mat3): Mat3 {
  const out: number[] = new Array(9);
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      out[r * 3 + c] =
        m[r * 3] * n[c] + m[r * 3 + 1] * n[3 + c] + m[r * 3 + 2] * n[6 + c];
  return out as unknown as Mat3;
}

/** Transpose: rows become columns. */
export function transpose3(m: Mat3): Mat3 {
  return [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]];
}

/** Inverse via the adjugate, or null if the matrix is singular (det ~ 0). */
export function inverse3(m: Mat3): Mat3 | null {
  const d = det3(m);
  if (Math.abs(d) < 1e-12) return null;
  return [
    (m[4] * m[8] - m[5] * m[7]) / d,
    (m[2] * m[7] - m[1] * m[8]) / d,
    (m[1] * m[5] - m[2] * m[4]) / d,
    (m[5] * m[6] - m[3] * m[8]) / d,
    (m[0] * m[8] - m[2] * m[6]) / d,
    (m[2] * m[3] - m[0] * m[5]) / d,
    (m[3] * m[7] - m[4] * m[6]) / d,
    (m[1] * m[6] - m[0] * m[7]) / d,
    (m[0] * m[4] - m[1] * m[3]) / d,
  ];
}

/** Per-entry linear interpolation from `from` to `to` at t in [0, 1]. */
export function lerp3(from: Mat3, to: Mat3, t: number): Mat3 {
  return from.map((x, i) => x + (to[i] - x) * t) as unknown as Mat3;
}

// --- Singular value decomposition -------------------------------------------

const dot3 = (a: Vec3, b: Vec3) => a.x * b.x + a.y * b.y + a.z * b.z;
const cross3 = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});
const norm3 = (v: Vec3) => Math.hypot(v.x, v.y, v.z);
function unit3(v: Vec3): Vec3 | null {
  const n = norm3(v);
  return n < 1e-12 ? null : { x: v.x / n, y: v.y / n, z: v.z / n };
}

/**
 * Eigen-decomposition of a symmetric 3x3 matrix by the cyclic Jacobi method:
 * repeatedly zero the largest off-diagonal entry with a plane rotation until
 * what's left is diagonal. Symmetric matrices always diagonalize this way, and
 * the accumulated rotations are the eigenvectors.
 *
 * Returns eigenvalues with their (orthonormal) eigenvectors, largest first.
 */
function symmetricEigen3(
  s: Mat3,
): { value: number; vec: Vec3 }[] {
  // Mutable working copies: `a` converges to the diagonal, `v` accumulates.
  const a = [
    [s[0], s[1], s[2]],
    [s[3], s[4], s[5]],
    [s[6], s[7], s[8]],
  ];
  const v = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
  const size = Math.max(Math.abs(a[0][0]), Math.abs(a[1][1]), Math.abs(a[2][2]), 1);
  const tol = 1e-14 * size;

  for (let sweep = 0; sweep < 60; sweep++) {
    // Largest off-diagonal entry in the upper triangle.
    let p = 0;
    let q = 1;
    let best = Math.abs(a[0][1]);
    if (Math.abs(a[0][2]) > best) {
      best = Math.abs(a[0][2]);
      p = 0;
      q = 2;
    }
    if (Math.abs(a[1][2]) > best) {
      best = Math.abs(a[1][2]);
      p = 1;
      q = 2;
    }
    if (best <= tol) break;

    // The rotation angle that annihilates a[p][q].
    const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
    const t =
      Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
    const c = 1 / Math.sqrt(t * t + 1);
    const sn = t * c;

    // a <- Rᵀ a R, applied in place on rows/columns p and q.
    for (let k = 0; k < 3; k++) {
      const akp = a[k][p];
      const akq = a[k][q];
      a[k][p] = c * akp - sn * akq;
      a[k][q] = sn * akp + c * akq;
    }
    for (let k = 0; k < 3; k++) {
      const apk = a[p][k];
      const aqk = a[q][k];
      a[p][k] = c * apk - sn * aqk;
      a[q][k] = sn * apk + c * aqk;
    }
    a[p][q] = 0;
    a[q][p] = 0;
    // v <- v R, so v's columns stay the eigenvectors.
    for (let k = 0; k < 3; k++) {
      const vkp = v[k][p];
      const vkq = v[k][q];
      v[k][p] = c * vkp - sn * vkq;
      v[k][q] = sn * vkp + c * vkq;
    }
  }

  const out = [0, 1, 2].map((i) => ({
    value: a[i][i],
    vec: { x: v[0][i], y: v[1][i], z: v[2][i] } as Vec3,
  }));
  out.sort((l, r) => r.value - l.value);
  return out;
}

export interface Svd3 {
  /** Singular values, largest first. All are >= 0. */
  sigma: [number, number, number];
  /** Right singular vectors: the perpendicular *input* axes, unit length. */
  v: [Vec3, Vec3, Vec3];
  /** Left singular vectors: the ellipsoid's semi-axis directions, unit length. */
  u: [Vec3, Vec3, Vec3];
  /** U reverses orientation (det U < 0) — equivalently, det M < 0. */
  flipped: boolean;
}

/**
 * Singular value decomposition of a 3x3 matrix: M = U * diag(σ) * Vᵀ. Same
 * story as the 2x2 case in matrix.ts — rotate, stretch along three
 * perpendicular axes, rotate — so every matrix carries the unit sphere onto an
 * ellipsoid with semi-axes σ₁ >= σ₂ >= σ₃.
 *
 * V comes from diagonalizing MᵀM, normalized so det V = +1 (a pure rotation);
 * u_i = M v_i / σ_i, with any collapsed axes filled in to keep U orthonormal.
 */
export function svd3(m: Mat3): Svd3 {
  const s = multiply3(transpose3(m), m);
  const eig = symmetricEigen3(s);

  // Orthonormal eigenvectors, oriented so V is a rotation rather than a
  // reflection — that keeps every orientation flip inside U.
  let v0 = unit3(eig[0].vec) ?? { x: 1, y: 0, z: 0 };
  let v1 = unit3(eig[1].vec) ?? { x: 0, y: 1, z: 0 };
  // Re-orthogonalize against v0 (Jacobi is accurate, but repeated eigenvalues
  // leave the pair only approximately perpendicular).
  const proj = dot3(v1, v0);
  v1 = unit3({
    x: v1.x - proj * v0.x,
    y: v1.y - proj * v0.y,
    z: v1.z - proj * v0.z,
  }) ?? { x: 0, y: 1, z: 0 };
  const v2 = cross3(v0, v1); // unit and perpendicular, and det [v0 v1 v2] = +1

  const s1 = Math.sqrt(Math.max(0, eig[0].value));
  const s2 = Math.sqrt(Math.max(0, eig[1].value));
  // σ₃ from the determinant rather than the third eigenvalue: σ₁σ₂σ₃ = |det M|
  // exactly, and the smallest eigenvalue is where a lopsided matrix loses its
  // precision (same reasoning as the 2x2 case in matrix.ts).
  const dt = det3(m);
  const sigma: [number, number, number] = [
    s1,
    s2,
    s1 * s2 > 0 ? Math.abs(dt) / (s1 * s2) : 0,
  ];
  const vs: [Vec3, Vec3, Vec3] = [v0, v1, v2];

  // u_i is the direction M v_i points. Normalizing (rather than dividing by
  // σ_i) keeps each one exactly unit length; a collapsed axis leaves its
  // output direction free, so fill those in by completing the frame.
  const FALLBACK: Vec3[] = [
    { x: 1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 0, z: 1 },
  ];
  // Only trust the image direction while σ_i is a real fraction of σ₁ — below
  // that, M v_i is numerical noise.
  const tol = 1e-8 * s1;
  const u0 = sigma[0] > tol ? unit3(apply3(m, v0)) : null;
  let u1v = sigma[1] > tol ? unit3(apply3(m, v1)) : null;
  const us: (Vec3 | null)[] = [u0, u1v, null];
  for (let i = 0; i < 2; i++) {
    if (us[i]) continue;
    // Gram-Schmidt a fallback axis against whatever is already fixed.
    const known = us.filter((x): x is Vec3 => x !== null);
    for (const cand of FALLBACK) {
      let w = { ...cand };
      for (const k of known) {
        const d = dot3(w, k);
        w = { x: w.x - d * k.x, y: w.y - d * k.y, z: w.z - d * k.z };
      }
      const uw = unit3(w);
      if (uw) {
        us[i] = uw;
        break;
      }
    }
    us[i] ??= FALLBACK[i];
  }
  // Re-orthogonalize u₂ against u₁ (they're perpendicular in exact arithmetic).
  u1v = us[1]!;
  const d01 = dot3(u1v, us[0]!);
  us[1] =
    unit3({
      x: u1v.x - d01 * us[0]!.x,
      y: u1v.y - d01 * us[0]!.y,
      z: u1v.z - d01 * us[0]!.z,
    }) ?? u1v;
  // u₃ is forced: U is orthogonal, so it's ±(u₁ × u₂), and since det V = +1 and
  // the σ are non-negative, det U carries the sign of det M.
  const c = cross3(us[0]!, us[1]!);
  us[2] = dt < 0 ? { x: -c.x, y: -c.y, z: -c.z } : c;

  const u = us as [Vec3, Vec3, Vec3];
  // det U from the triple product of its columns.
  const flipped = dot3(cross3(u[0], u[1]), u[2]) < 0;

  return { sigma, v: vs, u, flipped };
}
