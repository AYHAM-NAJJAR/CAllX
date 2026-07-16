import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { startAgentOutboundEngine } from "../../../services/realtime/stomp/Stompmake";

const WSContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useWS = () => useContext(WSContext);

export default function WebSocketProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  const handleUiUpdate = (update) => {
    setIsConnected(update.isWsConnected ?? false);

    console.log("GLOBAL WS UPDATE:", update);
  };

  const connect = (token, identity) => {
    if (wsRef.current) return; // منع تكرار الاتصال

    wsRef.current = startAgentOutboundEngine(
      token,
      identity,
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
    const token = localStorage.getItem("Token");
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email;
    

    if (token) {
      connect(token, email);
    }

    return () => disconnect();
  }, []);

  return (
    <WSContext.Provider value={{ isConnected, connect, disconnect }}>
      {children}
    </WSContext.Provider>
  );
}