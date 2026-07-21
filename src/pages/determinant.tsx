import React from "react";
import ReactDOM from "react-dom/client";
import ArticleShell from "../ArticleShell";
import Article from "../articles/determinant.mdx";
import "../styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ArticleShell
      title="The Determinant"
      subtitle="The number that measures a matrix"
      date="Summer 2026"
    >
      <Article />
    </ArticleShell>
  </React.StrictMode>,
);
