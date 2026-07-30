import { describe, expect, it } from "vitest";
import {
  apply,
  det,
  eigen,
  IDENTITY,
  inverse,
  lerp,
  multiply,
  svd,
  transpose,
  type Mat2,
  type Vec2,
} from "../src/matrix";
import {
  apply3,
  det3,
  IDENTITY3,
  inverse3,
  multiply3,
  svd3,
  transpose3,
  type Mat3,
} from "../src/matrix3";

// Deterministic PRNG so failures reproduce (mulberry32).
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = rng(20260717);
const entry = () => Math.round((rand() * 10 - 5) * 100) / 100;
const randMat2 = (): Mat2 => [entry(), entry(), entry(), entry()];
const randMat3 = (): Mat3 =>
  [entry(), entry(), entry(), entry(), entry(), entry(), entry(), entry(), entry()] as unknown as Mat3;
const randVec = (): Vec2 => ({ x: entry(), y: entry() });

const close = (a: number, b: number, tol = 1e-9) =>
  expect(Math.abs(a - b)).toBeLessThanOrEqual(tol * Math.max(1, Math.abs(a), Math.abs(b)));
const closeMat = (a: Mat2, b: Mat2, tol = 1e-9) =>
  a.forEach((_, i) => close(a[i], b[i], tol));

const N = 200;

describe("2x2 algebraic laws (randomized)", () => {
  it("det is multiplicative: det(AB) = det(A)det(B)", () => {
    for (let i = 0; i < N; i++) {
      const A = randMat2();
      const B = randMat2();
      close(det(multiply(A, B)), det(A) * det(B), 1e-7);
    }
  });

  it("A · A⁻¹ = I for invertible A; inverse(singular) = null", () => {
    for (let i = 0; i < N; i++) {
      const A = randMat2();
      const inv = inverse(A);
      if (inv) closeMat(multiply(A, inv), IDENTITY, 1e-6);
    }
    expect(inverse([2, 4, 1, 2])).toBeNull(); // det = 0
  });

  it("transpose is an involution and preserves det", () => {
    for (let i = 0; i < N; i++) {
      const A = randMat2();
      closeMat(transpose(transpose(A)), A);
      close(det(transpose(A)), det(A));
    }
  });

  it("multiplication is associative", () => {
    for (let i = 0; i < N; i++) {
      const [A, B, C] = [randMat2(), randMat2(), randMat2()];
      closeMat(multiply(multiply(A, B), C), multiply(A, multiply(B, C)), 1e-6);
    }
  });

  it("apply is linear: A(u + v) = Au + Av", () => {
    for (let i = 0; i < N; i++) {
      const A = randMat2();
      const u = randVec();
      const v = randVec();
      const lhs = apply(A, { x: u.x + v.x, y: u.y + v.y });
      const Au = apply(A, u);
      const Av = apply(A, v);
      close(lhs.x, Au.x + Av.x, 1e-8);
      close(lhs.y, Au.y + Av.y, 1e-8);
    }
  });

  it("lerp hits its endpoints", () => {
    for (let i = 0; i < 20; i++) {
      const A = randMat2();
      const B = randMat2();
      closeMat(lerp(A, B, 0), A);
      closeMat(lerp(A, B, 1), B);
    }
  });
});

describe("eigen", () => {
  it("real eigenpairs satisfy A·v = λ·v", () => {
    let realSeen = 0;
    for (let i = 0; i < N * 2 && realSeen < N; i++) {
      const A = randMat2();
      const e = eigen(A);
      if (e.kind !== "real") continue;
      realSeen++;
      for (const { value, vec } of e.pairs) {
        const Av = apply(A, vec);
        close(Av.x, value * vec.x, 1e-6);
        close(Av.y, value * vec.y, 1e-6);
      }
    }
    expect(realSeen).toBeGreaterThan(50); // sanity: the sample wasn't all-complex
  });

  it("classifies rotation as complex, λI as uniform, shear as repeated", () => {
    expect(eigen([0, -1, 1, 0]).kind).toBe("complex"); // 90° rotation
    const u = eigen([3, 0, 0, 3]);
    expect(u).toEqual({ kind: "uniform", value: 3 });
    const s = eigen([1, 1, 0, 1]);
    expect(s.kind === "real" && s.repeated).toBe(true);
  });

  it("eigenvalues multiply to det and sum to trace", () => {
    for (let i = 0; i < N; i++) {
      const A = randMat2();
      const e = eigen(A);
      if (e.kind === "real" && !e.repeated) {
        close(e.pairs[0].value * e.pairs[1].value, det(A), 1e-6);
        close(e.pairs[0].value + e.pairs[1].value, A[0] + A[3], 1e-6);
      }
    }
  });
});

describe("3x3 algebraic laws (randomized)", () => {
  it("det3 is multiplicative", () => {
    for (let i = 0; i < N; i++) {
      const A = randMat3();
      const B = randMat3();
      close(det3(multiply3(A, B)), det3(A) * det3(B), 1e-6);
    }
  });

  it("A · A⁻¹ = I₃ for invertible A", () => {
    for (let i = 0; i < N; i++) {
      const A = randMat3();
      const inv = inverse3(A);
      if (!inv) continue;
      const prod = multiply3(A, inv);
      prod.forEach((x, k) => close(x, IDENTITY3[k], 1e-5));
    }
  });

  it("transpose3 is an involution and preserves det3", () => {
    for (let i = 0; i < N; i++) {
      const A = randMat3();
      transpose3(transpose3(A)).forEach((x, k) => close(x, A[k]));
      close(det3(transpose3(A)), det3(A), 1e-7);
    }
  });

  it("apply3 agrees with det on volume scaling of the unit cube", () => {
    // |det| = volume of the image parallelepiped: (Ae₁ × Ae₂) · Ae₃
    for (let i = 0; i < N; i++) {
      const A = randMat3();
      const e1 = apply3(A, { x: 1, y: 0, z: 0 });
      const e2 = apply3(A, { x: 0, y: 1, z: 0 });
      const e3 = apply3(A, { x: 0, y: 0, z: 1 });
      const cross = {
        x: e1.y * e2.z - e1.z * e2.y,
        y: e1.z * e2.x - e1.x * e2.z,
        z: e1.x * e2.y - e1.y * e2.x,
      };
      const triple = cross.x * e3.x + cross.y * e3.y + cross.z * e3.z;
      close(triple, det3(A), 1e-6);
    }
  });
});

describe("svd (2x2)", () => {
  // Hand-picked degenerate cases alongside the random sweep: the interesting
  // failures all live at det = 0 or at extreme conditioning.
  const EDGE: Mat2[] = [
    [1, 0, 0, 1],          // identity
    [0, 0, 0, 0],          // zero
    [0, 1, 1, 0],          // reflection, det < 0
    [2, 1, 4, 2],          // singular
    [1, 2, 3, 6],          // rank 1, general position
    [3, 0, 0, 3],          // uniform scale (repeated singular value)
    [0.6, -0.8, 0.8, 0.6], // pure rotation
    [1e-7, 0, 0, 5],       // σ₁/σ₂ ~ 1e8
  ];
  const cases = (): Mat2[] => [
    ...EDGE,
    ...Array.from({ length: N }, () => randMat2()),
  ];

  it("U · Σ · Vᵀ reconstructs M", () => {
    for (const m of cases()) {
      const s = svd(m);
      closeMat(multiply(multiply(s.uMat, s.sMat), transpose(s.vMat)), m, 1e-8);
    }
  });

  it("σ₁ ≥ σ₂ ≥ 0, and σ₁·σ₂ = |det M|", () => {
    for (const m of cases()) {
      const s = svd(m);
      expect(s.sigma[0]).toBeGreaterThanOrEqual(s.sigma[1] - 1e-12);
      expect(s.sigma[1]).toBeGreaterThanOrEqual(-1e-12);
      close(s.sigma[0] * s.sigma[1], Math.abs(det(m)), 1e-8);
    }
  });

  it("U and V are orthonormal, with V a pure rotation", () => {
    for (const m of cases()) {
      const s = svd(m);
      // det V = +1 is the normalization that forces any flip into U.
      close(det(s.vMat), 1, 1e-9);
      for (const [a, b] of [s.u, s.v]) {
        close(Math.hypot(a.x, a.y), 1, 1e-9);
        close(Math.hypot(b.x, b.y), 1, 1e-9);
        expect(Math.abs(a.x * b.x + a.y * b.y)).toBeLessThan(1e-9);
      }
    }
  });

  it("flags the flip exactly when det M < 0", () => {
    for (const m of cases()) {
      if (Math.abs(det(m)) < 1e-9) continue; // sign is free for singular M
      expect(svd(m).flipped).toBe(det(m) < 0);
    }
  });

  it("maps each input axis onto its semi-axis: M·vᵢ = σᵢ·uᵢ", () => {
    for (const m of cases()) {
      const s = svd(m);
      for (const i of [0, 1]) {
        const w = apply(m, s.v[i]);
        close(w.x, s.sigma[i] * s.u[i].x, 1e-8);
        close(w.y, s.sigma[i] * s.u[i].y, 1e-8);
      }
    }
  });

  it("σ₁ and σ₂ really are the extreme stretches on the unit circle", () => {
    // The geometric claim the lesson rests on, checked by brute force rather
    // than by trusting the formula that produced them.
    for (const m of cases()) {
      const s = svd(m);
      let max = 0;
      let min = Infinity;
      for (let k = 0; k < 2000; k++) {
        const a = (2 * Math.PI * k) / 2000;
        const w = apply(m, { x: Math.cos(a), y: Math.sin(a) });
        const n = Math.hypot(w.x, w.y);
        if (n > max) max = n;
        if (n < min) min = n;
      }
      // Sampling can only understate the max and overstate the min.
      expect(max).toBeLessThanOrEqual(s.sigma[0] + 1e-9);
      expect(max).toBeGreaterThan(s.sigma[0] - 1e-2 * Math.max(1, s.sigma[0]));
      expect(min).toBeGreaterThanOrEqual(s.sigma[1] - 1e-9);
      expect(min).toBeLessThan(s.sigma[1] + 1e-2 * Math.max(1, s.sigma[0]));
    }
  });

  it("recovers an exactly-known decomposition", () => {
    // Both rotations are 3-4-5 triangles, so M has short decimal entries and
    // the singular values come back exactly 3 and 1. This is the matrix the
    // SVD lesson takes apart.
    const M = multiply(multiply([0.6, -0.8, 0.8, 0.6], [3, 0, 0, 1]), [0.8, 0.6, -0.6, 0.8]);
    closeMat(M, [1.92, 0.44, 1.56, 1.92], 1e-12);
    const s = svd(M);
    close(s.sigma[0], 3, 1e-12);
    close(s.sigma[1], 1, 1e-12);
    close(s.v[0].x, 0.8, 1e-12);
    close(s.v[0].y, 0.6, 1e-12);
    expect(s.flipped).toBe(false);
  });

  it("a stretch-then-spin keeps the warped gridlines perpendicular", () => {
    // Why the decomposition needs *two* rotations: with nothing in front of
    // the stretch, the image of the grid can never be sheared.
    for (let a = 0; a < 360; a += 3) {
      const th = (a * Math.PI) / 180;
      const rot: Mat2 = [Math.cos(th), -Math.sin(th), Math.sin(th), Math.cos(th)];
      for (const [s1, s2] of [[0.2, 0.4], [1, 1], [3, 7], [12, 0.5]]) {
        const C = multiply(rot, [s1, 0, 0, s2] as Mat2);
        // Columns are the images of î and ĵ, i.e. the grid directions.
        expect(Math.abs(C[0] * C[1] + C[2] * C[3])).toBeLessThan(1e-9);
      }
    }
  });
});

describe("svd3", () => {
  const EDGE: Mat3[] = [
    IDENTITY3,
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],  // rank 2
    [1, 1, 1, 1, 1, 1, 1, 1, 1],  // rank 1
    [0, 1, 0, 1, 0, 0, 0, 0, 1],  // reflection, det < 0
    [2, 0, 0, 0, 2, 0, 0, 0, 2],  // uniform (triply repeated σ)
    [1e-8, 0, 0, 0, 1, 0, 0, 0, 2],
  ];
  const cases = (): Mat3[] => [
    ...EDGE,
    ...Array.from({ length: N }, () => randMat3()),
  ];
  const frame = (v: readonly { x: number; y: number; z: number }[]): Mat3 =>
    [
      v[0].x, v[1].x, v[2].x,
      v[0].y, v[1].y, v[2].y,
      v[0].z, v[1].z, v[2].z,
    ] as unknown as Mat3;

  it("U · Σ · Vᵀ reconstructs M", () => {
    for (const m of cases()) {
      const s = svd3(m);
      const S = [s.sigma[0], 0, 0, 0, s.sigma[1], 0, 0, 0, s.sigma[2]] as unknown as Mat3;
      const recon = multiply3(multiply3(frame(s.u), S), transpose3(frame(s.v)));
      recon.forEach((x, k) => close(x, m[k], 1e-7));
    }
  });

  it("σ descend, and their product is |det M|", () => {
    for (const m of cases()) {
      const s = svd3(m);
      expect(s.sigma[0]).toBeGreaterThanOrEqual(s.sigma[1] - 1e-9);
      expect(s.sigma[1]).toBeGreaterThanOrEqual(s.sigma[2] - 1e-9);
      expect(s.sigma[2]).toBeGreaterThanOrEqual(-1e-12);
      close(s.sigma[0] * s.sigma[1] * s.sigma[2], Math.abs(det3(m)), 1e-6);
    }
  });

  it("U and V are orthonormal frames, with V a pure rotation", () => {
    for (const m of cases()) {
      const s = svd3(m);
      close(det3(frame(s.v)), 1, 1e-7);
      for (const F of [frame(s.u), frame(s.v)]) {
        const g = multiply3(transpose3(F), F);
        g.forEach((x, k) => close(x, IDENTITY3[k], 1e-7));
      }
    }
  });

  it("maps each input axis onto its semi-axis: M·vᵢ = σᵢ·uᵢ", () => {
    for (const m of cases()) {
      const s = svd3(m);
      for (const i of [0, 1, 2]) {
        const w = apply3(m, s.v[i]);
        close(w.x, s.sigma[i] * s.u[i].x, 1e-7);
        close(w.y, s.sigma[i] * s.u[i].y, 1e-7);
        close(w.z, s.sigma[i] * s.u[i].z, 1e-7);
      }
    }
  });

  it("drops a singular value to zero when a row is the sum of the others", () => {
    // The one-keystroke rank collapse the lesson's 3D panel asks for.
    const flat: Mat3 = [1, 1, 0, 0, 2, 1, 1, 3, 1];
    const s = svd3(flat);
    close(det3(flat), 0, 1e-12);
    expect(s.sigma[2]).toBeLessThan(1e-12);
    expect(s.sigma[1]).toBeGreaterThan(1e-3);
  });
});
