import React from "react";
import ReactDOM from "react-dom/client";
import ArticleShell from "../ArticleShell";
import Article from "../articles/svd.mdx";
import "../styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ArticleShell
      title="Singular Values"
      subtitle="Every matrix is a stretch in disguise"
      date="Summer 2026"
    >
      <Article />
    </ArticleShell>
  </React.StrictMode>,
);
