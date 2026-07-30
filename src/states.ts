/**
 * Pre-baked Warp scenes, one constant per embed. Each is the payload of a
 * warp.us.com share link (the part after `#s=`) — authoring one is just
 * building the scene in Warp and copying the address bar.
 */

/**
 * Where the embedded scenes come from. Point it at a local Warp during
 * development — `VITE_WARP_URL=http://localhost:5173 npm run dev` — to try
 * lesson scenes against unreleased sandbox features. Production always builds
 * against warp.us.com.
 */
export const WARP_URL =
  import.meta.env.VITE_WARP_URL ?? "https://warp.us.com";

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

// --- SVD. Needs Warp's svd() / circle() / sphere() primitives and its
// --- gridlines-only matrix view (all shipped alongside this lesson).
// --- All eight verified live against a local Warp build.

/** M = [[1.6,1.1],[-0.4,1.4]] + circle(), gridlines only: the hook. */
export const SVD_HOOK =
  "eyJ2IjoxLCJtb2RlIjoiMmQiLCJkMiI6eyJyb3dzIjpbeyJrIjoibSIsIm4iOiJNIiwiYyI6WyIxLjYiLCIxLjEiLCItMC40IiwiMS40Il19LHsiayI6ImUiLCJzIjoiY2lyY2xlKCkiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOjAsImciOnRydWV9LCJkMyI6eyJyb3dzIjpbeyJrIjoiZSIsInMiOiIiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9fQ";

/** The same matrix + svd(M): σ₁ = 2.041, σ₂ = 1.313 on the ellipse's axes. */
export const SVD_AXES =
  "eyJ2IjoxLCJtb2RlIjoiMmQiLCJkMiI6eyJyb3dzIjpbeyJrIjoibSIsIm4iOiJNIiwiYyI6WyIxLjYiLCIxLjEiLCItMC40IiwiMS40Il19LHsiayI6ImUiLCJzIjoiY2lyY2xlKCkiLCJzaCI6dHJ1ZX0seyJrIjoiZSIsInMiOiJzdmQoTSkiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOjAsImciOnRydWV9LCJkMyI6eyJyb3dzIjpbeyJrIjoiZSIsInMiOiIiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9fQ";

/**
 * C = U·S (stretch, then spin). Its input axes are stuck on x and y
 * and its columns always come out perpendicular — which is why one rotation
 * isn't enough. C = [[1.5,-0.8],[2,0.6]], σ = 2.5 and 1, "Vᵀ spins 0°".
 */
export const SVD_TWOSTEP =
  "eyJ2IjoxLCJtb2RlIjoiMmQiLCJkMiI6eyJyb3dzIjpbeyJrIjoibSIsIm4iOiJVIiwiYyI6WyIwLjYiLCItMC44IiwiMC44IiwiMC42Il19LHsiayI6Im0iLCJuIjoiUyIsImMiOlsiMi41IiwiMCIsIjAiLCIxIl19LHsiayI6ImUiLCJzIjoiQyA9IFXCt1MiLCJzaCI6dHJ1ZX0seyJrIjoiZSIsInMiOiJjaXJjbGUoKSIsInNoIjp0cnVlfSx7ImsiOiJlIiwicyI6InN2ZChDKSIsInNoIjp0cnVlfV0sImFjdGl2ZSI6MiwiZyI6dHJ1ZX0sImQzIjp7InJvd3MiOlt7ImsiOiJlIiwicyI6IiIsInNoIjp0cnVlfV0sImFjdGl2ZSI6bnVsbH19";

/**
 * C = U·S·Vt with S = diag(3, 1) and both rotations exact 3-4-5
 * triangles, so C = [[1.92,0.44],[1.56,1.92]] on the nose. Play walks Vt, then
 * S, then U.
 */
export const SVD_DECOMP =
  "eyJ2IjoxLCJtb2RlIjoiMmQiLCJkMiI6eyJyb3dzIjpbeyJrIjoibSIsIm4iOiJVIiwiYyI6WyIwLjYiLCItMC44IiwiMC44IiwiMC42Il19LHsiayI6Im0iLCJuIjoiUyIsImMiOlsiMyIsIjAiLCIwIiwiMSJdfSx7ImsiOiJtIiwibiI6IlZ0IiwiYyI6WyIwLjgiLCIwLjYiLCItMC42IiwiMC44Il19LHsiayI6ImUiLCJzIjoiQyA9IFXCt1PCt1Z0Iiwic2giOnRydWV9LHsiayI6ImUiLCJzIjoiY2lyY2xlKCkiLCJzaCI6dHJ1ZX0seyJrIjoiZSIsInMiOiJzdmQoQykiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOjMsImciOnRydWV9LCJkMyI6eyJyb3dzIjpbeyJrIjoiZSIsInMiOiIiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9fQ";

/**
 * That same matrix typed in directly: σ₁·σ₂ = 3·1 = det(M) = 3. Full
 * view — the unit parallelogram is the determinant's own picture.
 */
export const SVD_DET =
  "eyJ2IjoxLCJtb2RlIjoiMmQiLCJkMiI6eyJyb3dzIjpbeyJrIjoibSIsIm4iOiJNIiwiYyI6WyIxLjkyIiwiMC40NCIsIjEuNTYiLCIxLjkyIl19LHsiayI6ImUiLCJzIjoiY2lyY2xlKCkiLCJzaCI6dHJ1ZX0seyJrIjoiZSIsInMiOiJzdmQoTSkiLCJzaCI6dHJ1ZX0seyJrIjoiZSIsInMiOiJkZXQoTSkiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOjB9LCJkMyI6eyJyb3dzIjpbeyJrIjoiZSIsInMiOiIiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9fQ";

/**
 * S = diag(3, 0.2): a sliver of an ellipse, still invertible. Typing 0
 * into S's corner collapses it onto a line and inv(C) gives up.
 */
export const SVD_RANK =
  "eyJ2IjoxLCJtb2RlIjoiMmQiLCJkMiI6eyJyb3dzIjpbeyJrIjoibSIsIm4iOiJVIiwiYyI6WyIwLjYiLCItMC44IiwiMC44IiwiMC42Il19LHsiayI6Im0iLCJuIjoiUyIsImMiOlsiMyIsIjAiLCIwIiwiMC4yIl19LHsiayI6Im0iLCJuIjoiVnQiLCJjIjpbIjAuOCIsIjAuNiIsIi0wLjYiLCIwLjgiXX0seyJrIjoiZSIsInMiOiJDID0gVcK3U8K3VnQiLCJzaCI6dHJ1ZX0seyJrIjoiZSIsInMiOiJjaXJjbGUoKSIsInNoIjp0cnVlfSx7ImsiOiJlIiwicyI6InN2ZChDKSIsInNoIjp0cnVlfSx7ImsiOiJlIiwicyI6ImRldChDKSIsInNoIjp0cnVlfSx7ImsiOiJlIiwicyI6ImludihDKSIsInNoIjp0cnVlfV0sImFjdGl2ZSI6MywiZyI6dHJ1ZX0sImQzIjp7InJvd3MiOlt7ImsiOiJlIiwicyI6IiIsInNoIjp0cnVlfV0sImFjdGl2ZSI6bnVsbH19";

/**
 * 3D: the unit sphere onto an ellipsoid, σ = 2.532 / 1.347 / 0.879,
 * det = 3. Lattice only.
 */
export const SVD_SPHERE =
  "eyJ2IjoxLCJtb2RlIjoiM2QiLCJkMiI6eyJyb3dzIjpbeyJrIjoiZSIsInMiOiIiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9LCJkMyI6eyJyb3dzIjpbeyJrIjoibSIsIm4iOiJNIiwiYyI6WyIxIiwiMSIsIjAiLCIwIiwiMiIsIjEiLCIxIiwiMCIsIjEiXX0seyJrIjoiZSIsInMiOiJzcGhlcmUoKSIsInNoIjp0cnVlfSx7ImsiOiJlIiwicyI6InN2ZChNKSIsInNoIjp0cnVlfSx7ImsiOiJlIiwicyI6ImRldChNKSIsInNoIjp0cnVlfV0sImFjdGl2ZSI6MCwiZyI6dHJ1ZX19";

/** A blank sandbox for the closing challenges. */
export const SVD_BLANK =
  "eyJ2IjoxLCJtb2RlIjoiMmQiLCJkMiI6eyJyb3dzIjpbeyJrIjoiZSIsInMiOiIiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9LCJkMyI6eyJyb3dzIjpbeyJrIjoiZSIsInMiOiIiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9fQ";
