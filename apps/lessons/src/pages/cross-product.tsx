import React from "react";
import ReactDOM from "react-dom/client";
import ArticleShell from "../ArticleShell";
import Article from "../articles/cross-product.mdx";
import "../styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ArticleShell
      title="The Cross Product"
      subtitle="A vector that measures a parallelogram — in 3D"
      date="Summer 2026"
    >
      <Article />
    </ArticleShell>
  </React.StrictMode>,
);
