// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import { startAgentOutboundEngine } from "../../../services/realtime/stomp/Stompmake";
// import { useCall } from "../../../context/Call/CallContext";

// const WSContext = createContext();

// // eslint-disable-next-line react-refresh/only-export-components
// export const useWS = () => useContext(WSContext);

// export default function WebSocketProvider({ children }) {
//   const [isConnected, setIsConnected] = useState(false);
//   const wsRef = useRef(null);

//   const { initInboundEngine } = useCall();

//   const handleUiUpdate = (update) => {
//     setIsConnected(update.isWsConnected ?? false);

//     console.log("GLOBAL WS UPDATE:", update);
//   };

//   const connect = () => {
//     if (wsRef.current) return;

//     const token = localStorage.getItem("Token");

//     const user = JSON.parse(localStorage.getItem("user") || "{}");

//     if (!token || !user?.email) return;

//     const queueId = "1";
//     const agentIdentity = user.email;

//     // Outbound Engine
//     wsRef.current = startAgentOutboundEngine(
//       token,
//       agentIdentity,
//       handleUiUpdate
//     );

//     // Inbound Engine
//     initInboundEngine(
//       token,
//       queueId,
//       agentIdentity
//     );
//   };

//   const disconnect = () => {
//     if (wsRef.current?.disconnect) {
//       wsRef.current.disconnect();
//     }

//     wsRef.current = null;
//     setIsConnected(false);
//   };

//   useEffect(() => {
//     connect();

//     return () => {
//       disconnect();
//     };
//   }, []);

//   return (
//     <WSContext.Provider
//       value={{
//         isConnected,
//         connect,
//         disconnect,
//       }}
//     >
//       {children}
//     </WSContext.Provider>
//   );
// }