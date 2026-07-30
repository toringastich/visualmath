import React from "react";
import ReactDOM from "react-dom/client";
import ArticleShell from "../ArticleShell";
import Article from "../articles/eigenvectors.mdx";
import "../styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ArticleShell
      title="Eigenvectors"
      subtitle="The vectors that refuse to turn"
      date="Summer 2026"
    >
      <Article />
    </ArticleShell>
  </React.StrictMode>,
);
