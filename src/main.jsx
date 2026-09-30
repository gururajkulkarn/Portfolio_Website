import React from "react";
import { MotionConfig } from "framer-motion";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

try {
  document.documentElement.dataset.theme = window.localStorage.getItem("portfolio-theme") === "light" ? "light" : "dark";
} catch {
  document.documentElement.dataset.theme = "dark";
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </React.StrictMode>,
);
