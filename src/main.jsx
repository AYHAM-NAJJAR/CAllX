import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import "./index.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CallProvider } from "./context/Call/CallContext";
import OutboundWSProvider from "./pages/Calling/context/OutboundWSContext";
import InboundWSProvider from "./pages/Calling/context/InboundWSContext";

createRoot(document.getElementById("root")).render(
  
    <Router>
      <CallProvider>
        <OutboundWSProvider>
        <InboundWSProvider>
          <App />
        </InboundWSProvider>
        </OutboundWSProvider>
      </CallProvider>

      <ToastContainer theme="dark" />
    </Router>
);