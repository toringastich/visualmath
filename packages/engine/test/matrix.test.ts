import { describe, expect, it } from "vitest";
import {
  apply,
  det,
  eigen,
  IDENTITY,
  inverse,
  lerp,
  multiply,
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
