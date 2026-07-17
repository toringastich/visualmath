/**
 * The lesson model. A lesson is a sequence of steps; each step pairs a short
 * piece of writing with a live Warp scene, loaded by URL hash — the same
 * share-link format the sandbox uses, so authoring a step is just building
 * the scene in Warp and copying the address bar's `#s=` payload.
 */

export const WARP_URL = "https://warp.us.com";

export interface LessonStep {
  title: string;
  /** Paragraphs of body text (rendered in order). */
  body: string[];
  /** Warp state hash (the part after `#s=`). Omit for text-only steps. */
  state?: string;
  /** Optional nudge shown under the scene ("Try dragging the slider"). */
  tryThis?: string;
  /**
   * URL of a recorded narration (mp3). When present the Listen button plays
   * it; when absent, narration falls back to the browser's built-in
   * text-to-speech reading the step text.
   */
  audio?: string;
}

export interface Lesson {
  slug: string;
  title: string;
  subtitle: string;
  status: "draft" | "published";
  steps: LessonStep[];
}

// --- Eigenvectors (DRAFT — placeholder copy, real scenes) -------------------
// The SoME 2026 entry grows here. States were generated against Warp's v1
// hash format.

const S1 =
  "eyJ2IjoxLCJtb2RlIjoiMmQiLCJkMiI6eyJyb3dzIjpbeyJrIjoibSIsIm4iOiJNIiwiYyI6WyIyIiwiMSIsIjEiLCIyIl19LHsiayI6InYiLCJuIjoidiIsImMiOlsiMSIsIjAiXSwic2giOnRydWV9XSwiYWN0aXZlIjowfSwiZDMiOnsicm93cyI6W3siayI6ImUiLCJzIjoiIiwic2giOnRydWV9XSwiYWN0aXZlIjpudWxsfX0";
const S2 =
  "eyJ2IjoxLCJtb2RlIjoiMmQiLCJkMiI6eyJyb3dzIjpbeyJrIjoibSIsIm4iOiJNIiwiYyI6WyIyIiwiMSIsIjEiLCIyIl19LHsiayI6InYiLCJuIjoidiIsImMiOlsiMSIsIjAiXSwic2giOnRydWV9LHsiayI6ImUiLCJzIjoiZWlnZW4oTSkiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOjB9LCJkMyI6eyJyb3dzIjpbeyJrIjoiZSIsInMiOiIiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9fQ";
const S3 =
  "eyJ2IjoxLCJtb2RlIjoiMmQiLCJkMiI6eyJyb3dzIjpbeyJrIjoibSIsIm4iOiJNIiwiYyI6WyIyIiwiMSIsIjEiLCIyIl19LHsiayI6InYiLCJuIjoidiIsImMiOlsiMSIsIjEiXSwic2giOnRydWV9LHsiayI6ImUiLCJzIjoiZWlnZW4oTSkiLCJzaCI6dHJ1ZX0seyJrIjoiZSIsInMiOiJ1ID0gTcK3diIsInNoIjp0cnVlfV0sImFjdGl2ZSI6MH0sImQzIjp7InJvd3MiOlt7ImsiOiJlIiwicyI6IiIsInNoIjp0cnVlfV0sImFjdGl2ZSI6bnVsbH19";

// Cross product in 3D: v and w in the xy-plane, then u = cross(v, w), then
// w tilted out of the plane. Verified against production warp.us.com.
const X1 =
  "eyJ2IjoxLCJtb2RlIjoiM2QiLCJkMiI6eyJyb3dzIjpbeyJrIjoiZSIsInMiOiIiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9LCJkMyI6eyJyb3dzIjpbeyJrIjoidiIsIm4iOiJ2IiwiYyI6WyIyIiwiMSIsIjAiXSwic2giOnRydWV9LHsiayI6InYiLCJuIjoidyIsImMiOlsiLTEiLCIyIiwiMCJdLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9fQ";
const X2 =
  "eyJ2IjoxLCJtb2RlIjoiM2QiLCJkMiI6eyJyb3dzIjpbeyJrIjoiZSIsInMiOiIiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9LCJkMyI6eyJyb3dzIjpbeyJrIjoidiIsIm4iOiJ2IiwiYyI6WyIyIiwiMSIsIjAiXSwic2giOnRydWV9LHsiayI6InYiLCJuIjoidyIsImMiOlsiLTEiLCIyIiwiMCJdLCJzaCI6dHJ1ZX0seyJrIjoiZSIsInMiOiJ1ID0gY3Jvc3ModiwgdykiLCJzaCI6dHJ1ZX0seyJrIjoiZSIsInMiOiJub3JtKHUpIiwic2giOnRydWV9XSwiYWN0aXZlIjpudWxsfX0";
const X3 =
  "eyJ2IjoxLCJtb2RlIjoiM2QiLCJkMiI6eyJyb3dzIjpbeyJrIjoiZSIsInMiOiIiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9LCJkMyI6eyJyb3dzIjpbeyJrIjoidiIsIm4iOiJ2IiwiYyI6WyIyIiwiMSIsIjAiXSwic2giOnRydWV9LHsiayI6InYiLCJuIjoidyIsImMiOlsiLTEiLCIyIiwiMSJdLCJzaCI6dHJ1ZX0seyJrIjoiZSIsInMiOiJ1ID0gY3Jvc3ModiwgdykiLCJzaCI6dHJ1ZX0seyJrIjoiZSIsInMiOiJkb3QodiwgdSkiLCJzaCI6dHJ1ZX1dLCJhY3RpdmUiOm51bGx9fQ";

export const LESSONS: Lesson[] = [
  {
    slug: "eigenvectors",
    title: "Eigenvectors",
    subtitle: "The vectors that refuse to turn",
    status: "draft",
    steps: [
      {
        title: "A matrix moves every vector…",
        body: [
          "PLACEHOLDER — Here's a matrix M warping the plane. The vector v = (1, 0) rides along: press play and watch where it lands.",
          "Almost every vector gets knocked off its own line — it ends up pointing somewhere new.",
        ],
        state: S1,
        tryThis: "Press ▶ on the matrix row and watch v swing off its line.",
      },
      {
        title: "…except the ones it can't turn",
        body: [
          "PLACEHOLDER — eigen(M) draws two dashed lines. Vectors on those lines don't get turned — the warp only stretches them, by a factor λ.",
          "Those are the eigenvectors of M, and the λ values are its eigenvalues.",
        ],
        state: S2,
        tryThis: "Play the warp again and watch the orange and purple vectors stay on their lines.",
      },
      {
        title: "See it with your own vector",
        body: [
          "PLACEHOLDER — v = (1, 1) sits exactly on an eigen-line, and u = M·v shows where it lands: (3, 3). Stretched by 3, never turned.",
          "That's the whole idea. Everything else about eigenvectors is bookkeeping.",
        ],
        state: S3,
        tryThis: "Edit v to leave the eigen-line, then put it back. Feel the difference.",
      },
      {
        title: "Now it's yours",
        body: [
          "PLACEHOLDER — The sandbox is open-ended: try eigen on a rotation (no real eigenvectors — nothing survives a turn), a shear (one line survives), or the identity (everything survives).",
        ],
        tryThis: "Open Warp and type eigen(M) on a matrix of your own.",
      },
    ],
  },
  {
    slug: "cross-product",
    title: "The Cross Product",
    subtitle: "A vector that measures a parallelogram — in 3D",
    status: "draft",
    steps: [
      {
        title: "Two vectors span a parallelogram",
        body: [
          "Here are v = (2, 1, 0) and w = (−1, 2, 0), both lying flat in the xy-plane. Together they span a parallelogram — the shaded patch between them.",
          "Every question the cross product answers starts with this patch: how big is it, and which way does it face?",
        ],
        state: X1,
        tryThis: "Drag to orbit the scene. The parallelogram lies completely flat.",
      },
      {
        title: "cross(v, w) answers both at once",
        body: [
          "u = cross(v, w) comes out to (0, 0, 5): a vector pointing straight up, perpendicular to both v and w.",
          "Its length is no accident — norm(u) = 5 is exactly the parallelogram's area. And its direction follows the right-hand rule: curl your fingers from v toward w, and your thumb points along u.",
        ],
        state: X2,
        tryThis: "Orbit underneath the scene — u never leans; it's perpendicular to the whole patch.",
      },
      {
        title: "It follows the parallelogram",
        body: [
          "Tilt w out of the plane — w = (−1, 2, 1) — and the parallelogram tilts with it. The cross product follows: u = (1, −2, 5) leans exactly enough to stay perpendicular.",
          "The row dot(v, u) = 0 is the receipt: perpendicularity isn't a coincidence of the first example, it's built into the definition.",
        ],
        state: X3,
        tryThis: "Edit w's entries and watch u rebalance to stay perpendicular to the patch.",
      },
      {
        title: "Now it's yours",
        body: [
          "Make v and w parallel and the parallelogram collapses — the cross product returns the zero vector. Make them perpendicular unit vectors and the area is exactly 1.",
          "The cross product is the parallelogram, wearing a vector costume.",
        ],
        tryThis: "Open Warp in 3D, build two vectors of your own, and take their cross product.",
      },
    ],
  },
];
