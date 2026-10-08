import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ApplicationsProvider } from "./context/ApplicationsContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { ProfileProvider } from "./context/ProfileContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary> 
    <BrowserRouter>
      <ApplicationsProvider>
        <ProfileProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </ProfileProvider>
      </ApplicationsProvider>
    </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
