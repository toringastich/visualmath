import React from "react";
import ReactDOM from "react-dom/client";
import ArticleShell from "../ArticleShell";
import Article from "../articles/determinant.mdx";
import "../styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ArticleShell
      title="The Determinant"
      subtitle="The one number that measures everything"
      date="Summer 2026"
    >
      <Article />
    </ArticleShell>
  </React.StrictMode>,
);
