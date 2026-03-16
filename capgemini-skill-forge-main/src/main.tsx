/**
 * Application Entry Point
 * 
 * Initializes the React application and mounts it to the DOM.
 * Loads global stylesheets and bootstraps the root App component.
 */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found in HTML");
}

createRoot(rootElement).render(<App />);
