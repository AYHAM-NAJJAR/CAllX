import { useEffect } from "react";
import { connectStomp } from "../services/realtime/stomp/stopm";
import { useCall } from "../context/Call/CallContext";

export const useCallSocket = () => {
  const { addIncomingCall } = useCall();

  useEffect(() => {

    console.log("HOOK STARTED");

    connectStomp((message) => {

      console.log(
        "MESSAGE RECEIVED",
        message
      );

      addIncomingCall(message);

    });

  }, []);
};