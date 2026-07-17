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
];
