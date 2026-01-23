import { createRoot } from "react-dom/client";
import App from "./App";
import {
  preloadSpines,
  setupI18n,
  setupIpc,
  setupWebListeners,
} from "./prelude";
import { StrictMode } from "react";

preloadSpines();
setupI18n();
setupIpc();
setupWebListeners();

const root = createRoot(document.getElementById("app")!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
