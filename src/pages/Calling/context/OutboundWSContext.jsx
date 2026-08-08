import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { startAgentOutboundEngine } from "../../../services/realtime/stomp/Stompmake";

const OutboundWSContext = createContext();

export const useOutboundWS = () => useContext(OutboundWSContext);

export default function OutboundWSProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  const handleUiUpdate = (update) => {
    setIsConnected(update.isWsConnected ?? false);
  };

  const connect = () => {
    if (wsRef.current) return;
    const token = localStorage.getItem("Token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token || !user?.email) return;

    const agentIdentity = user.email;

    wsRef.current = startAgentOutboundEngine(
      token,
      agentIdentity,
      handleUiUpdate
    );
  };

  const disconnect = () => {
    if (wsRef.current?.disconnect) {
      wsRef.current.disconnect();
    }
    wsRef.current = null;
    setIsConnected(false);
  };

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);

  return (
    <OutboundWSContext.Provider value={{ isConnected, connect, disconnect }}>
      {children}
    </OutboundWSContext.Provider>
  );
}