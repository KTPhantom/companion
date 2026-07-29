import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import AppRoutes from "./app/routes/AppRoutes";
import ErrorBoundary from "./shared/components/ErrorBoundary";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  </React.StrictMode>
);
