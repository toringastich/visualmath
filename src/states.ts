/**
 * Pre-baked Warp scenes, one constant per embed. Each is the payload of a
 * warp.us.com share link (the part after `#s=`) — authoring one is just
 * building the scene in Warp and copying the address bar.
 */

export const WARP_URL = "https://warp.us.com";

// --- Eigenvectors (2D): M = [[2,1],[1,2]] ----------------------------------

/** M warping the plane; v = (1, 0) rides along. */
export const EIGEN_RIDE =
  "eyJ2IjoxLCJtb2RlIjoiMmQiLCJkMiI6eyJyb3dzIjpbeyJrIjoibSIsIm4iOiJNIiwiYyI6WyIyIiwiMSIsIjEiLCIyIl19LHsiayI6InYiLCJuIjoidiIsImMiOlsiMSIsIjAiXSwic2giOnRydWV9XSwiYWN0aXZlIjowfSwiZDMiOnsicm93cyI6W3siayI6ImUiLCJzIjoiIiwic2giOnRydWV9XSwiYWN0aXZlIjpudWxsfX0";

/** Same scene + eigen(M): invariant lines and unit eigenvectors. */
export const EIGEN_LINES =
  "eyJ2IjoxLCJtb2RlIjoiMmQiLCJkMiI6eyJyb3dzIjpbeyJrIjoibSIsIm4iOiJNIiwiYyI6WyIyIiwiMSIsIjEiLCIyIl19LHsiayI6InYiLCJuIjoidiIsImMiOlsiMSIsIjAiXSwic2giOnRydWV9LHsiayI6ImUiLCJzIjoiZWlnZW4oTSkiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOjB9LCJkMyI6eyJyb3dzIjpbeyJrIjoiZSIsInMiOiIiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9fQ";

/** v = (1, 1) on the eigen-line, with u = M·v landing at (3, 3). */
export const EIGEN_ON_LINE =
  "eyJ2IjoxLCJtb2RlIjoiMmQiLCJkMiI6eyJyb3dzIjpbeyJrIjoibSIsIm4iOiJNIiwiYyI6WyIyIiwiMSIsIjEiLCIyIl19LHsiayI6InYiLCJuIjoidiIsImMiOlsiMSIsIjEiXSwic2giOnRydWV9LHsiayI6ImUiLCJzIjoiZWlnZW4oTSkiLCJzaCI6dHJ1ZX0seyJrIjoiZSIsInMiOiJ1ID0gTcK3diIsInNoIjp0cnVlfV0sImFjdGl2ZSI6MH0sImQzIjp7InJvd3MiOlt7ImsiOiJlIiwicyI6IiIsInNoIjp0cnVlfV0sImFjdGl2ZSI6bnVsbH19";

// --- Cross product (3D): v = (2,1,0) ----------------------------------------

/** v and w flat in the xy-plane, spanning a parallelogram. */
export const CROSS_FLAT =
  "eyJ2IjoxLCJtb2RlIjoiM2QiLCJkMiI6eyJyb3dzIjpbeyJrIjoiZSIsInMiOiIiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9LCJkMyI6eyJyb3dzIjpbeyJrIjoidiIsIm4iOiJ2IiwiYyI6WyIyIiwiMSIsIjAiXSwic2giOnRydWV9LHsiayI6InYiLCJuIjoidyIsImMiOlsiLTEiLCIyIiwiMCJdLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9fQ";

/** + u = cross(v, w) = (0, 0, 5) and norm(u) = 5. */
export const CROSS_UP =
  "eyJ2IjoxLCJtb2RlIjoiM2QiLCJkMiI6eyJyb3dzIjpbeyJrIjoiZSIsInMiOiIiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9LCJkMyI6eyJyb3dzIjpbeyJrIjoidiIsIm4iOiJ2IiwiYyI6WyIyIiwiMSIsIjAiXSwic2giOnRydWV9LHsiayI6InYiLCJuIjoidyIsImMiOlsiLTEiLCIyIiwiMCJdLCJzaCI6dHJ1ZX0seyJrIjoiZSIsInMiOiJ1ID0gY3Jvc3ModiwgdykiLCJzaCI6dHJ1ZX0seyJrIjoiZSIsInMiOiJub3JtKHUpIiwic2giOnRydWV9XSwiYWN0aXZlIjpudWxsfX0";

/** w tilted out of the plane; dot(v, u) = 0 stays true. */
export const CROSS_TILT =
  "eyJ2IjoxLCJtb2RlIjoiM2QiLCJkMiI6eyJyb3dzIjpbeyJrIjoiZSIsInMiOiIiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9LCJkMyI6eyJyb3dzIjpbeyJrIjoidiIsIm4iOiJ2IiwiYyI6WyIyIiwiMSIsIjAiXSwic2giOnRydWV9LHsiayI6InYiLCJuIjoidyIsImMiOlsiLTEiLCIyIiwiMSJdLCJzaCI6dHJ1ZX0seyJrIjoiZSIsInMiOiJ1ID0gY3Jvc3ModiwgdykiLCJzaCI6dHJ1ZX0seyJrIjoiZSIsInMiOiJkb3QodiwgdSkiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9fQ";

// --- Determinant. All five verified live against production warp.us.com. ----

/** M = [[3,1],[0,2]], det(M) = 6 — the shaded parallelogram's area. */
export const DET_AREA =
  "eyJ2IjoxLCJtb2RlIjoiMmQiLCJkMiI6eyJyb3dzIjpbeyJrIjoibSIsIm4iOiJNIiwiYyI6WyIzIiwiMSIsIjAiLCIyIl19LHsiayI6ImUiLCJzIjoiZGV0KE0pIiwic2giOnRydWV9XSwiYWN0aXZlIjowfSwiZDMiOnsicm93cyI6W3siayI6ImUiLCJzIjoiIiwic2giOnRydWV9XSwiYWN0aXZlIjpudWxsfX0";

/** M = [[0,1],[1,0]], det(M) = -1. Play: grid collapses at det=0, reopens flipped. */
export const DET_FLIP =
  "eyJ2IjoxLCJtb2RlIjoiMmQiLCJkMiI6eyJyb3dzIjpbeyJrIjoibSIsIm4iOiJNIiwiYyI6WyIwIiwiMSIsIjEiLCIwIl19LHsiayI6ImUiLCJzIjoiZGV0KE0pIiwic2giOnRydWV9XSwiYWN0aXZlIjowfSwiZDMiOnsicm93cyI6W3siayI6ImUiLCJzIjoiIiwic2giOnRydWV9XSwiYWN0aXZlIjpudWxsfX0";

/** 3D M = [[2,1,0],[0,1,1],[0,0,1]], det(M) = 2 — an upper-triangular slanted box. */
export const DET_VOLUME =
  "eyJ2IjoxLCJtb2RlIjoiM2QiLCJkMiI6eyJyb3dzIjpbeyJrIjoiZSIsInMiOiIiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9LCJkMyI6eyJyb3dzIjpbeyJrIjoibSIsIm4iOiJNIiwiYyI6WyIyIiwiMSIsIjAiLCIwIiwiMSIsIjEiLCIwIiwiMCIsIjEiXX0seyJrIjoiZSIsInMiOiJkZXQoTSkiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOjB9fQ";

/** C = M·N with det(M)=2, det(N)=3, det(C)=6 — the multiplicative law, animated. */
export const DET_COMPOSE =
  "eyJ2IjoxLCJtb2RlIjoiMmQiLCJkMiI6eyJyb3dzIjpbeyJrIjoibSIsIm4iOiJNIiwiYyI6WyIyIiwiMSIsIjAiLCIxIl19LHsiayI6Im0iLCJuIjoiTiIsImMiOlsiMSIsIjAiLCIxIiwiMyJdfSx7ImsiOiJlIiwicyI6IkMgPSBNwrdOIiwic2giOnRydWV9LHsiayI6ImUiLCJzIjoiZGV0KE0pIiwic2giOnRydWV9LHsiayI6ImUiLCJzIjoiZGV0KE4pIiwic2giOnRydWV9LHsiayI6ImUiLCJzIjoiZGV0KEMpIiwic2giOnRydWV9XSwiYWN0aXZlIjoyfSwiZDMiOnsicm93cyI6W3siayI6ImUiLCJzIjoiIiwic2giOnRydWV9XSwiYWN0aXZlIjpudWxsfX0";

/** M = [[2,1],[4,2]], det(M) = 0: space collapses to a line, inv(M) fails. */
export const DET_INVERT =
  "eyJ2IjoxLCJtb2RlIjoiMmQiLCJkMiI6eyJyb3dzIjpbeyJrIjoibSIsIm4iOiJNIiwiYyI6WyIyIiwiMSIsIjQiLCIyIl19LHsiayI6ImUiLCJzIjoiZGV0KE0pIiwic2giOnRydWV9LHsiayI6ImUiLCJzIjoiaW52KE0pIiwic2giOnRydWV9XSwiYWN0aXZlIjowfSwiZDMiOnsicm93cyI6W3siayI6ImUiLCJzIjoiIiwic2giOnRydWV9XSwiYWN0aXZlIjpudWxsfX0";

/** A blank sandbox — nothing pre-loaded, for open experimentation. */
export const DET_BLANK =
  "eyJ2IjoxLCJtb2RlIjoiMmQiLCJkMiI6eyJyb3dzIjpbeyJrIjoiZSIsInMiOiIiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9LCJkMyI6eyJyb3dzIjpbeyJrIjoiZSIsInMiOiIiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9fQ";
