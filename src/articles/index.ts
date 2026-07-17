/** Article metadata for the home page. Slug = URL path segment = page name. */
export interface ArticleMeta {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  status: "draft" | "published";
}

export const ARTICLES: ArticleMeta[] = [
  {
    slug: "eigenvectors",
    title: "Eigenvectors",
    subtitle: "The vectors that refuse to turn",
    date: "Summer 2026",
    status: "draft",
  },
  {
    slug: "cross-product",
    title: "The Cross Product",
    subtitle: "A vector that measures a parallelogram — in 3D",
    date: "Summer 2026",
    status: "draft",
  },
];
