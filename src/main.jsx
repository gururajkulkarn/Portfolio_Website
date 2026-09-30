import React from "react";
import { MotionConfig } from "framer-motion";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </React.StrictMode>,
);
