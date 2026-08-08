import React, { createContext, useContext, useEffect } from "react";
import { useCall } from "../../../context/Call/CallContext";

const InboundWSContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useInboundWS = () => useContext(InboundWSContext);

export default function InboundWSProvider({ children }) {
  const { initInboundEngine } = useCall();

  useEffect(() => {
    const token = localStorage.getItem("Token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token || !user?.email) return;

    const queueId = "1";
    const agentIdentity = user.email;

    
    initInboundEngine(token, queueId, agentIdentity);

   
  }, []);

  return (
    <InboundWSContext.Provider value={{}}>
      {children}
    </InboundWSContext.Provider>
  );
}