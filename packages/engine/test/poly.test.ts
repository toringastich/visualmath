import { describe, expect, it } from "vitest";
import {
  add,
  constant,
  constValue,
  diff,
  isConst,
  mul,
  pow,
  scale,
  symbol,
  toText,
  type Poly,
} from "../src/poly";
import { col3, IDENTITY3, lerp3, type Mat3 } from "../src/matrix3";

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
const rand = rng(20260803);
const coef = () => Math.round((rand() * 10 - 5) * 100) / 100;

const X = symbol(0);
const Y = symbol(1);
const Z = symbol(2);

/** A random polynomial: a handful of terms of degree <= 3 in x, y, z. */
function randPoly(terms = 4): Poly {
  let p = constant(coef());
  for (let i = 0; i < terms; i++) {
    const vars = [X, Y, Z][Math.floor(rand() * 3)];
    p = add(p, scale(pow(vars, Math.floor(rand() * 3) + 1), coef()));
  }
  return p;
}

/**
 * Polynomial equality. Comparing maps directly is wrong: a zero coefficient is
 * supposed to be absent rather than stored, and `add` is what prunes it -- so
 * `sub(p, p)` must come out as the empty map, not as zeros.
 */
const same = (a: Poly, b: Poly, tol = 1e-9) => {
  const diffMap = add(a, b, -1);
  for (const [k, c] of diffMap) {
    expect(Math.abs(c), `term ${k} differs by ${c}`).toBeLessThanOrEqual(tol);
  }
};

/** Numeric evaluation, the independent check that the symbolic algebra agrees. */
function evalAt(p: Poly, x: number, y: number, z: number): number {
  let total = 0;
  for (const [k, c] of p) {
    const [ex, ey, ez] = k.split(",").map(Number);
    total += c * x ** ex * y ** ey * z ** ez;
  }
  return total;
}

const N = 200;
const POINTS: [number, number, number][] = [
  [0, 0, 0],
  [1, 1, 1],
  [2, -3, 0.5],
  [-1.25, 0.75, -2],
];

describe("the polynomial ring (randomized)", () => {
  it("addition and multiplication commute", () => {
    for (let i = 0; i < N; i++) {
      const a = randPoly();
      const b = randPoly();
      same(add(a, b), add(b, a));
      same(mul(a, b), mul(b, a));
    }
  });

  it("multiplication is associative and distributes over addition", () => {
    for (let i = 0; i < N; i++) {
      const a = randPoly();
      const b = randPoly();
      const c = randPoly();
      same(mul(mul(a, b), c), mul(a, mul(b, c)));
      same(mul(a, add(b, c)), add(mul(a, b), mul(a, c)));
    }
  });

  it("0 and 1 are the additive and multiplicative identities", () => {
    for (let i = 0; i < N; i++) {
      const a = randPoly();
      same(add(a, constant(0)), a);
      same(mul(a, constant(1)), a);
      same(mul(a, constant(0)), constant(0));
    }
  });

  it("p − p is exactly empty, not a map of zeros", () => {
    for (let i = 0; i < N; i++) {
      const a = randPoly();
      expect(add(a, a, -1).size).toBe(0);
    }
  });

  it("scale agrees with multiplying by a constant, and by 0 annihilates", () => {
    for (let i = 0; i < N; i++) {
      const a = randPoly();
      const s = coef();
      same(scale(a, s), mul(a, constant(s)));
      expect(scale(a, 0).size).toBe(0);
    }
  });

  it("symbolic algebra agrees with numeric evaluation", () => {
    for (let i = 0; i < N; i++) {
      const a = randPoly();
      const b = randPoly();
      for (const [x, y, z] of POINTS) {
        const av = evalAt(a, x, y, z);
        const bv = evalAt(b, x, y, z);
        expect(evalAt(add(a, b), x, y, z)).toBeCloseTo(av + bv, 9);
        expect(evalAt(mul(a, b), x, y, z)).toBeCloseTo(av * bv, 9);
      }
    }
  });
});

describe("pow", () => {
  it("p⁰ = 1 and p¹ = p", () => {
    for (let i = 0; i < 50; i++) {
      const a = randPoly();
      same(pow(a, 0), constant(1));
      same(pow(a, 1), a);
    }
  });

  it("pᵐ · pⁿ = pᵐ⁺ⁿ", () => {
    for (let i = 0; i < 50; i++) {
      const a = randPoly(2);
      same(mul(pow(a, 2), pow(a, 3)), pow(a, 5));
    }
  });

  it("expands a known binomial: (x + y)³", () => {
    const cube = pow(add(X, Y), 3);
    // x³ + 3x²y + 3xy² + y³
    expect(cube.get("3,0,0")).toBeCloseTo(1, 12);
    expect(cube.get("2,1,0")).toBeCloseTo(3, 12);
    expect(cube.get("1,2,0")).toBeCloseTo(3, 12);
    expect(cube.get("0,3,0")).toBeCloseTo(1, 12);
    expect(cube.size).toBe(4);
  });
});

describe("diff", () => {
  it("is linear", () => {
    for (let i = 0; i < N; i++) {
      const a = randPoly();
      const b = randPoly();
      for (const axis of [0, 1, 2] as const) {
        same(diff(add(a, b), axis), add(diff(a, axis), diff(b, axis)));
      }
    }
  });

  it("obeys the product rule", () => {
    for (let i = 0; i < N; i++) {
      const a = randPoly(2);
      const b = randPoly(2);
      for (const axis of [0, 1, 2] as const) {
        same(
          diff(mul(a, b), axis),
          add(mul(diff(a, axis), b), mul(a, diff(b, axis))),
        );
      }
    }
  });

  it("kills constants, and mixed partials commute", () => {
    expect(diff(constant(7), 0).size).toBe(0);
    for (let i = 0; i < 50; i++) {
      const a = randPoly();
      same(diff(diff(a, 0), 1), diff(diff(a, 1), 0));
    }
  });

  it("differentiates each variable only with respect to itself", () => {
    same(diff(X, 0), constant(1));
    expect(diff(X, 1).size).toBe(0);
    expect(diff(X, 2).size).toBe(0);
    same(diff(pow(X, 3), 0), scale(pow(X, 2), 3));
    same(diff(mul(X, Y), 0), Y);
    same(diff(mul(X, Y), 1), X);
  });

  it("d/dx of a polynomial matches a numeric difference quotient", () => {
    const h = 1e-6;
    for (let i = 0; i < 50; i++) {
      const a = randPoly();
      const d = diff(a, 0);
      for (const [x, y, z] of POINTS) {
        const numeric = (evalAt(a, x + h, y, z) - evalAt(a, x - h, y, z)) / (2 * h);
        expect(evalAt(d, x, y, z)).toBeCloseTo(numeric, 4);
      }
    }
  });
});

describe("constant, symbol, isConst, constValue", () => {
  it("a zero constant is the empty polynomial", () => {
    expect(constant(0).size).toBe(0);
    expect(isConst(constant(0))).toBe(true);
    expect(constValue(constant(0))).toBe(0);
  });

  it("round-trips a nonzero constant", () => {
    expect(constValue(constant(-4.25))).toBeCloseTo(-4.25, 12);
    expect(isConst(constant(-4.25))).toBe(true);
  });

  it("symbols are not constants, and name the axis they were given", () => {
    expect(isConst(X)).toBe(false);
    expect(X.get("1,0,0")).toBe(1);
    expect(Y.get("0,1,0")).toBe(1);
    expect(Z.get("0,0,1")).toBe(1);
  });

  it("a cancelling sum becomes constant again", () => {
    // (x + 1) − x = 1
    expect(isConst(add(add(X, constant(1)), X, -1))).toBe(true);
    expect(constValue(add(add(X, constant(1)), X, -1))).toBeCloseTo(1, 12);
  });
});

describe("toText", () => {
  const fmt = (n: number) => String(Math.round(n * 1000) / 1000);

  it("prints the empty polynomial as 0", () => {
    expect(toText(constant(0), fmt)).toBe("0");
  });

  it("sorts by descending degree and drops unit coefficients", () => {
    // Degree orders the terms, so the constant lands last: 3, then 2, then 0.
    const p = add(
      add(scale(pow(X, 3), 2), mul(X, Y)),
      constant(4),
      -1,
    );
    expect(toText(p, fmt)).toBe("2x³ + xy − 4");
  });

  it("breaks degree ties by the x, then y, then z exponent", () => {
    // All degree 2: x², xy, xz, y², yz, z².
    const p = [
      pow(X, 2),
      mul(X, Y),
      mul(X, Z),
      pow(Y, 2),
      mul(Y, Z),
      pow(Z, 2),
    ].reduce((acc, t) => add(acc, t), constant(0));
    expect(toText(p, fmt)).toBe("x² + xy + xz + y² + yz + z²");
  });

  it("uses superscripts and a real minus sign", () => {
    expect(toText(scale(pow(Y, 12), -1), fmt)).toBe("−y¹²");
    expect(toText(pow(Z, 2), fmt)).toBe("z²");
  });

  it("keeps a leading negative tight but spaces interior signs", () => {
    const p = add(scale(X, -1), constant(3));
    expect(toText(p, fmt)).toBe("−x + 3");
  });
});

// col3 and lerp3 are the two matrix3 helpers the 3x3 suite in matrix.test.ts
// does not reach; the rest of that module is covered there.
describe("matrix3 helpers", () => {
  const M: Mat3 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  it("col3 reads columns, i.e. where each basis vector lands", () => {
    expect(col3(M, 0)).toEqual({ x: 1, y: 4, z: 7 });
    expect(col3(M, 1)).toEqual({ x: 2, y: 5, z: 8 });
    expect(col3(M, 2)).toEqual({ x: 3, y: 6, z: 9 });
    expect(col3(IDENTITY3, 1)).toEqual({ x: 0, y: 1, z: 0 });
  });

  it("lerp3 hits its endpoints and the midpoint", () => {
    expect(lerp3(IDENTITY3, M, 0)).toEqual([...IDENTITY3]);
    expect(lerp3(IDENTITY3, M, 1)).toEqual([...M]);
    const mid = lerp3(IDENTITY3, M, 0.5);
    IDENTITY3.forEach((from, i) =>
      expect(mid[i]).toBeCloseTo((from + M[i]) / 2, 12),
    );
  });
});
