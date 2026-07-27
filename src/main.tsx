import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { initTelemetry } from "./analytics";
import "./styles.css";

// Before React, so the pageview lands even if the app itself throws — and
// outside the tree, so StrictMode's double render can't set it up twice.
initTelemetry();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
