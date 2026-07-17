import { describe, expect, it } from "vitest";
import {
  constMat2,
  constVec2,
  evaluate,
  ExprError,
  numMat2,
  numScalar,
  numVec2,
  parse,
  parseBinding,
  type Env,
  type Value,
} from "../src/expr";
import { isConst, constValue } from "../src/poly";

/** Evaluate a source string in an env built from plain numbers. */
function run(src: string, bindings: Record<string, Value> = {}): Value {
  const env: Env = new Map(Object.entries(bindings));
  return evaluate(parse(src), env);
}

const scalarOf = (v: Value): number => {
  if (v.kind !== "scalar") throw new Error(`expected scalar, got ${v.kind}`);
  const n = numScalar(v.value);
  if (n === null) throw new Error("expected a numeric scalar");
  return n;
};

const M = constMat2([2, 1, 1, 2]);
const v = constVec2({ x: 3, y: -1 });
const w = constVec2({ x: 1, y: 4 });

describe("evaluator basics", () => {
  it("computes det, inverse, transpose through the parser", () => {
    expect(scalarOf(run("det(M)", { M }))).toBe(3);
    const inv = run("inv(M)", { M });
    expect(inv.kind === "matrix" && numMat2(inv.value)).toEqual([
      2 / 3,
      -1 / 3,
      -1 / 3,
      2 / 3,
    ]);
  });

  it("matrix-vector and vector arithmetic", () => {
    const mv = run("M·v", { M, v });
    expect(mv.kind === "vector" && numVec2(mv.value)).toEqual({ x: 5, y: 1 });
    const sum = run("v + 2w", { v, w });
    expect(sum.kind === "vector" && numVec2(sum.value)).toEqual({ x: 5, y: 7 });
  });

  it("dot, cross, norm, proj obey their defining identities", () => {
    expect(scalarOf(run("dot(v, w)", { v, w }))).toBe(-1);
    // cross in 2D = signed area = det of the column matrix
    expect(scalarOf(run("cross(v, w)", { v, w }))).toBe(13);
    expect(scalarOf(run("norm(v)·norm(v) - dot(v, v)", { v }))).toBeCloseTo(0, 9);
    // proj(v, w) is parallel to w and the residual is perpendicular to w
    const p = run("proj(v, w)", { v, w });
    const pv = p.kind === "vector" ? numVec2(p.value)! : null!;
    expect(pv.x * 4 - pv.y * 1).toBeCloseTo(0, 9); // parallel: cross(p, w) = 0
    expect((3 - pv.x) * 1 + (-1 - pv.y) * 4).toBeCloseTo(0, 9); // residual ⊥ w
  });

  it("typed errors: adding a vector and a matrix throws ExprError", () => {
    expect(() => run("v + M", { M, v })).toThrow(ExprError);
  });

  it("parseBinding splits names and rejects non-bindings", () => {
    expect(parseBinding("u = M·v")).toEqual({ name: "u", expr: " M·v" });
    expect(parseBinding("det(M)")).toBeNull();
  });
});

describe("symbolic identities (the calculus safety net)", () => {
  const constOf = (src: string): number => {
    const val = run(src);
    if (val.kind !== "scalar") throw new Error(`expected scalar, got ${val.kind}`);
    if (!isConst(val.value)) throw new Error("expected a constant polynomial");
    return constValue(val.value);
  };

  it("symbolic dot products commute: dot(F, G) − dot(G, F) = 0", () => {
    expect(constOf("dot((2x, 3y), (x^2, xy)) - dot((x^2, xy), (2x, 3y))")).toBe(0);
  });

  it("divergence of a curl is identically zero (3D)", () => {
    expect(constOf("dot(del, cross(del, (xy, yz, zx)))")).toBe(0);
  });

  it("curl of the rotation field (-y, x) is the constant 2", () => {
    expect(constOf("cross(del, (-y, x))")).toBe(2);
  });

  it("divergence of a linear radial field is its trace: dot(del, (3x, 5y)) = 8", () => {
    expect(constOf("dot(del, (3x, 5y))")).toBe(8);
  });
});
