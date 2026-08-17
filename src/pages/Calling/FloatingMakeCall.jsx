
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import Draggable from "react-draggable";

import {
  PhoneCall,
  X,
  Hash,
  PhoneOff,
  Activity,
} from "lucide-react";

import { useOutboundWS } from "./context/OutboundWSContext";

import { CALL_STATUS } from "../../services/call/Livekit/livekitConstants";

import {
  endActiveOutboundCall,
  initiateOutboundCall,
} from "../../services/realtime/stomp/Stompmake";

const FloatingMakeCall = ({
  onClose,
  number,
}) => {
  // =========================================================
  // REFS
  // =========================================================

  const nodeRef = useRef(null);
  const timerRef = useRef(null);

  // لمعرفة أن component ما زال موجوداً
  const mountedRef = useRef(false);

  // منع إغلاق الـ Floating أكثر من مرة
  const closingRef = useRef(false);

  // منع إرسال Hangup أكثر من مرة
  const hangupInProgressRef = useRef(false);

  // =========================================================
  // CONTEXT
  // =========================================================

  const {
    isConnected: isWsConnected,
  } = useOutboundWS();

  // =========================================================
  // TOKEN
  // =========================================================

  const token =
    localStorage.getItem("Token");

  // =========================================================
  // STATE
  // =========================================================

  const [
    phoneNumber,
    setPhoneNumber,
  ] = useState(number || "");

  const [
    callState,
    setCallState,
  ] = useState(CALL_STATUS.IDLE);

  const [
    currentCallId,
    setCurrentCallId,
  ] = useState(null);

  const [
    uiMessage,
    setUiMessage,
  ] = useState("");

  const [
    seconds,
    setSeconds,
  ] = useState(0);

  const [
    timerActive,
    setTimerActive,
  ] = useState(false);

  // =========================================================
  // MOUNT / UNMOUNT
  // =========================================================

  useEffect(() => {
    mountedRef.current = true;

    console.log(
      "🟢 FloatingMakeCall MOUNTED"
    );

    return () => {
      console.log(
        "🔴 FloatingMakeCall UNMOUNTED"
      );

      mountedRef.current = false;

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // =========================================================
  // UPDATE PHONE NUMBER IF PROP CHANGES
  // =========================================================

  useEffect(() => {
    if (number !== undefined && number !== null) {
      setPhoneNumber(number);
    }
  }, [number]);

  // =========================================================
  // TIMER
  // =========================================================

  useEffect(() => {
    if (!timerActive) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      return;
    }

    console.log(
      "⏱️ CALL TIMER STARTED"
    );

    timerRef.current = setInterval(() => {
      setSeconds((previous) => previous + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerActive]);

  // =========================================================
  // FORMAT TIMER
  // =========================================================

  const formatTime = () => {
    const minutes = Math.floor(
      seconds / 60
    );

    const secs = seconds % 60;

    return (
      `${minutes < 10 ? "0" : ""}${minutes}:` +
      `${secs < 10 ? "0" : ""}${secs}`
    );
  };

  // =========================================================
  // RESET TIMER
  // =========================================================

  const resetTimer = useCallback(() => {
    console.log(
      "⏱️ RESETTING TIMER"
    );

    setTimerActive(false);
    setSeconds(0);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // =========================================================
  // CLOSE FLOATING
  // =========================================================

  const closeFloating = useCallback(() => {
    console.log(
      "🚪 closeFloating() CALLED"
    );

    // -------------------------------------------------------
    // منع التكرار
    // -------------------------------------------------------

    if (closingRef.current) {
      console.log(
        "⚠️ closeFloating already executed."
      );

      return;
    }

    closingRef.current = true;

    // -------------------------------------------------------
    // STOP TIMER
    // -------------------------------------------------------

    resetTimer();

    // -------------------------------------------------------
    // RESET LOCAL DATA
    // -------------------------------------------------------

    setCurrentCallId(null);

    setCallState(
      CALL_STATUS.IDLE
    );

    // -------------------------------------------------------
    // CALL PARENT
    // -------------------------------------------------------

    console.log(
      "🚪 Calling parent onClose()..."
    );

    if (typeof onClose === "function") {
      onClose();
    } else {
      console.error(
        "❌ onClose is not a function!"
      );
    }
  }, [
    onClose,
    resetTimer,
  ]);

  // =========================================================
  // HANDLE UI UPDATE
  //
  // هذه الدالة تستقبل كل شيء من Stompmake.js
  // =========================================================

  const handleUiUpdate = useCallback(
    (update) => {
      console.log(
        "🔥 FLOATING HANDLE UI UPDATE:",
        update
      );

      // -------------------------------------------------------
      // إذا component لم يعد موجوداً
      // -------------------------------------------------------

      if (!mountedRef.current) {
        console.warn(
          "⚠️ Floating is already unmounted."
        );

        return;
      }

      // =====================================================
      // CALL ID
      // =====================================================

      if (
        update?.callId !== undefined
      ) {
        console.log(
          "📌 Floating callId:",
          update.callId
        );

        setCurrentCallId(
          update.callId
        );
      }

      // =====================================================
      // MESSAGE
      // =====================================================

      if (update?.message) {
        setUiMessage(
          update.message
        );
      }

      // =====================================================
      // TIMER START
      // =====================================================

      if (update?.startTimer === true) {
        console.log(
          "⏱️ START TIMER REQUEST RECEIVED"
        );

        setSeconds(0);
        setTimerActive(true);
      }

      // =====================================================
      // TERMINAL EVENT
      //
      // هذا أهم جزء.
      //
      // إذا Stompmake.js أرسل:
      //
      // terminal: true
      //
      // فالـ Floating يغلق مباشرة.
      // =====================================================

      // =====================================================
      // FINAL SERVER EVENTS
      //
      // IMPORTANT:
      // لا نعتمد فقط على update.terminal.
      // في حال وصل ENDED / REJECTED / CANCELLED من STOMP
      // بدون terminal:true، يجب إغلاق الـ Floating مباشرة.
      // =====================================================

      const normalizedStatus =
        update?.status?.toString()?.trim()?.toUpperCase();

      const normalizedEvent =
        update?.event?.toString()?.trim()?.toUpperCase();

      const FINAL_STATUSES = new Set([
        "ENDED",
        "REJECTED",
        "CANCELLED",
      ]);

      const FINAL_EVENTS = new Set([
        "ENDED",
        "REJECTED",
        "CANCELLED",
      ]);

      const isFinalServerEvent =
        update?.terminal === true ||
        FINAL_STATUSES.has(normalizedStatus) ||
        FINAL_EVENTS.has(normalizedEvent);

      if (isFinalServerEvent) {
        console.log(
          "🛑 FINAL SERVER EVENT RECEIVED -> CLOSING FLOATING",
          {
            terminal: update?.terminal,
            status: normalizedStatus,
            event: normalizedEvent,
            callId: update?.callId,
            currentCallId,
            message: update?.message,
          }
        );

        // ---------------------------------------------------
        // STOP TIMER
        // ---------------------------------------------------

        resetTimer();

        // ---------------------------------------------------
        // SAVE FINAL STATUS BEFORE CLOSE
        // ---------------------------------------------------

        if (normalizedStatus) {
          setCallState(normalizedStatus);
        }

        // ---------------------------------------------------
        // SHOW FINAL MESSAGE (if provided)
        // ---------------------------------------------------

        if (update?.message) {
          setUiMessage(update.message);
        }

        // ---------------------------------------------------
        // CLOSE FLOATING
        // closeFloating() already protects against duplicate calls.
        // ---------------------------------------------------

        closeFloating();

        return;
      }

      // =====================================================
      // =====================================================
      // NON-FINAL EVENTS
      //
      // أي حدث محلي مثل LOCAL_HANGUP لا يغلق الـ Floating.
      // الإغلاق هنا مخصص فقط للأحداث النهائية أعلاه.
      // =====================================================


      // =====================================================
      // LOCAL HANGUP / LOCAL CLEANUP
      //
      // لا نعتبر LOCAL_HANGUP أو LOCAL_HANGUP_ERROR
      // إشارة لإغلاق الـ Floating.
      // نترك الـ Floating مفتوحاً بانتظار الحدث النهائي
      // من STOMP Topic.
      // =====================================================

      const isLocalCleanupEvent =
        normalizedEvent === "LOCAL_HANGUP" ||
        normalizedEvent === "LOCAL_HANGUP_ERROR";

      if (isLocalCleanupEvent) {
        console.log(
          "⏳ LOCAL CLEANUP RECEIVED — WAITING FOR STOMP TERMINAL EVENT:",
          {
            status: normalizedStatus,
            event: normalizedEvent,
            callId: update?.callId,
            message: update?.message,
          }
        );

        // فقط حدّث الرسالة إذا كانت موجودة، ولا تغلق الـ Floating.
        if (update?.message) {
          setUiMessage(update.message);
        }

        return;
      }

      // =====================================================
      // NORMAL STATUS
      //
      // الحالات العادية مثل RINGING و CONNECTED تبقى
      // معروضة ولا تسبب إغلاق الـ Floating.
      // =====================================================

      if (update?.status) {
        console.log(
          "📌 NORMAL CALL STATE:",
          update.status
        );

        setCallState(
          update.status
        );
      }
    },
    [
      closeFloating,
      resetTimer,
    ]
  );

  // =========================================================
  // START CALL
  // =========================================================

  const handleCall = async () => {
    console.log(
      "📞 START CALL CLICKED"
    );

    // -------------------------------------------------------
    // Reset closing protection
    // -------------------------------------------------------

    closingRef.current = false;

    hangupInProgressRef.current = false;

    // -------------------------------------------------------
    // Phone validation
    // -------------------------------------------------------

    if (!phoneNumber) {
      alert(
        "الرجاء إدخال رقم هاتف العميل"
      );

      return;
    }

    // -------------------------------------------------------
    // WebSocket validation
    // -------------------------------------------------------

    if (!isWsConnected) {
      console.warn(
        "❌ WebSocket is not connected."
      );

      setUiMessage(
        "محرك الاتصال غير متصل بالسيرفر."
      );

      return;
    }

    // -------------------------------------------------------
    // Token validation
    // -------------------------------------------------------

    if (!token) {
      console.error(
        "❌ Token not found."
      );

      setUiMessage(
        "رمز الدخول غير موجود."
      );

      return;
    }

    // -------------------------------------------------------
    // Reset UI
    // -------------------------------------------------------

    resetTimer();

    setCurrentCallId(null);

    setUiMessage("");

    setCallState(
      CALL_STATUS.IDLE
    );

    // -------------------------------------------------------
    // Initiate
    // -------------------------------------------------------

    try {
      await initiateOutboundCall(
        phoneNumber,
        token,
        handleUiUpdate
      );
    } catch (error) {
      console.error(
        "❌ initiateOutboundCall failed:",
        error
      );

      setCallState(
        CALL_STATUS.IDLE
      );

      setUiMessage(
        error?.message ||
          "فشل بدء المكالمة."
      );
    }
  };

  // =========================================================
  // HANG UP
  // =========================================================

  const handleHangUp = async () => {
    console.log(
      "🛑 HANG UP CLICKED"
    );

    // -------------------------------------------------------
    // منع الضغط مرتين
    // -------------------------------------------------------

    if (
      hangupInProgressRef.current
    ) {
      console.log(
        "⚠️ Hangup already in progress."
      );

      return;
    }

    hangupInProgressRef.current = true;

    // -------------------------------------------------------
    // Token
    // -------------------------------------------------------

    if (!token) {
      console.error(
        "❌ Token not found."
      );

      hangupInProgressRef.current = false;

      closeFloating();

      return;
    }

    try {
      // -----------------------------------------------------
      // IMPORTANT
      //
      // لا نغلق Floating مباشرة.
      //
      // نترك Stompmake يعمل:
      //
      // POST /api/calls/{callId}/end
      //
      // ثم cleanup
      //
      // ثم handleUiUpdate
      //
      // إذا كان cleanup محلياً:
      // LOCAL_HANGUP / LOCAL_HANGUP_ERROR
      //
      // الـ Floating لن يغلق.
      //
      // ثم ننتظر:
      //
      // STOMP Topic terminal event
      //
      // مثل:
      // ENDED / DISCONNECTED / HANGUP / HUNG_UP
      //
      // وعندها فقط:
      //
      // terminal:true
      //
      // ثم closeFloating
      // -----------------------------------------------------

      const result =
        await endActiveOutboundCall(
          token,
          handleUiUpdate
        );

      console.log(
        "🛑 END ACTIVE CALL RESULT:",
        result
      );

      // -----------------------------------------------------
      // لا نغلق هنا.
      //
      // مصدر الإغلاق هو terminal event القادم من STOMP.
      // -----------------------------------------------------

      if (!closingRef.current) {
        console.log(
          "⏳ Waiting for STOMP terminal event before closing Floating."
        );
      }
    } catch (error) {
      console.error(
        "❌ Hangup failed:",
        error
      );

      // -----------------------------------------------------
      // لا نغلق Floating تلقائياً هنا.
      //
      // ننتظر الحدث الحقيقي من STOMP.
      // -----------------------------------------------------

      setUiMessage(
        error?.message ||
          "حدث خطأ أثناء إنهاء المكالمة. بانتظار تأكيد السيرفر."
      );
    } finally {
      hangupInProgressRef.current = false;
      localStorage.removeItem("selectedClientId");
    }
  };

  // =========================================================
  // X BUTTON
  // =========================================================

  const handleCloseButton = () => {
    console.log(
      "❌ FLOATING X CLICKED"
    );

    // -------------------------------------------------------
    // إذا في مكالمة فعالة
    // X = Hangup
    // -------------------------------------------------------

    if (isCallActive) {
      console.log(
        "📞 Active call -> X means Hangup"
      );

      handleHangUp();

      return;
    }

    // -------------------------------------------------------
    // لا توجد مكالمة
    // X = Close
    // -------------------------------------------------------

    closeFloating();
  };

  // =========================================================
  // DOT COLOR
  // =========================================================

  const getDotColorClass = () => {
    // -------------------------------------------------------
    // WS disconnected
    // -------------------------------------------------------

    if (!isWsConnected) {
      return (
        "bg-rose-500 " +
        "shadow-[0_0_8px_rgba(244,63,94,0.5)]"
      );
    }

    // -------------------------------------------------------
    // Connected
    // -------------------------------------------------------

    if (
      callState ===
        CALL_STATUS.CONNECTED ||
      callState === "CONNECTED" ||
      callState === "ACCEPTED"
    ) {
      return (
        "bg-emerald-500 " +
        "animate-pulse " +
        "shadow-[0_0_8px_rgba(16,185,129,0.5)]"
      );
    }

    // -------------------------------------------------------
    // Ringing
    // -------------------------------------------------------

    if (
      callState ===
        CALL_STATUS.RINGING ||
      callState === "RINGING"
    ) {
      return (
        "bg-amber-500 " +
        "animate-pulse " +
        "shadow-[0_0_8px_rgba(245,158,11,0.5)]"
      );
    }

    // -------------------------------------------------------
    // Default
    // -------------------------------------------------------

    return (
      "bg-cyan-500 " +
      "shadow-[0_0_8px_rgba(6,182,212,0.5)]"
    );
  };

  // =========================================================
  // ACTIVE CALL
  // =========================================================

  const isCallActive =
    callState ===
      CALL_STATUS.RINGING ||
    callState === "RINGING" ||
    callState ===
      CALL_STATUS.CONNECTED ||
    callState === "CONNECTED" ||
    callState === "ACCEPTED";

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-header"
      bounds="body"
    >
      <div
        ref={nodeRef}
        className="
          fixed
          z-50
          w-[340px]
          bg-[#0b1329]
          text-white
          rounded-3xl
          shadow-2xl
          border
          border-slate-800/80
          p-5
          font-sans
          overflow-hidden
          select-none
        "
        style={{
          bottom: "40px",
          right: "40px",
        }}
      >
        {/* ================================================= */}
        {/* DRAG HEADER */}
        {/* ================================================= */}

        <div
          className="
            drag-header
            cursor-move
            w-full
            flex
            items-center
            justify-between
            py-1
            -mt-1
            mb-3
          "
        >
          <div
            className="
              w-12
              h-1
              bg-slate-700/60
              rounded-full
            "
          />

          <button
            onClick={handleCloseButton}
            className="
              p-1
              text-slate-400
              hover:text-white
              hover:bg-slate-800
              rounded-full
              transition-colors
            "
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-3">
            <div
              className="
                w-10
                h-10
                rounded-2xl
                bg-emerald-500/10
                border
                border-emerald-500/20
                flex
                items-center
                justify-center
                text-emerald-400
              "
            >
              <PhoneCall className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Make a Call
              </h3>

              <p
                className="
                  text-[10px]
                  text-slate-400
                  flex
                  items-center
                  gap-1.5
                  mt-0.5
                "
              >
                <span
                  className={`
                    w-2
                    h-2
                    rounded-full
                    ${getDotColorClass()}
                  `}
                />

                {isWsConnected
                  ? "Server Connected"
                  : "Connecting..."}
              </p>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* IDLE */}
        {/* ================================================= */}

        {!isCallActive ? (
          <>
            <div className="relative mb-4">
              <input
                type="text"
                value={phoneNumber}
                onChange={(event) =>
                  setPhoneNumber(
                    event.target.value
                  )
                }
                placeholder="Enter phone number..."
                dir="ltr"
                className="
                  w-full
                  bg-slate-900/80
                  border
                  border-slate-800/80
                  rounded-2xl
                  py-2.5
                  pl-9
                  pr-4
                  text-sm
                  text-slate-200
                  placeholder-slate-500
                  focus:outline-none
                  focus:border-emerald-500/50
                  transition-colors
                  font-mono
                "
              />

              <Hash
                className="
                  w-4
                  h-4
                  text-slate-500
                  absolute
                  left-3
                  top-3
                "
              />
            </div>

            <div
              className="
                mt-4
                pt-2
                border-t
                border-slate-800/50
              "
            >
              <button
                onClick={handleCall}
                disabled={!isWsConnected}
                className="
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-2
                  py-3
                  rounded-2xl
                  bg-emerald-500
                  hover:bg-emerald-600
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  text-gray-950
                  font-bold
                  text-xs
                  transition-colors
                  shadow-lg
                  shadow-emerald-500/20
                "
              >
                <PhoneCall className="w-4 h-4 fill-current" />

                <span>
                  START CALL
                </span>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* ================================================= */}
            {/* ACTIVE CALL */}
            {/* ================================================= */}

            <div
              className="
                bg-slate-900/80
                border
                border-slate-800
                rounded-2xl
                p-5
                mt-2
                text-center
                flex
                flex-col
                items-center
              "
            >
              <Activity
                className="
                  w-8
                  h-8
                  text-emerald-400
                  mb-2
                  animate-pulse
                "
              />

              <div
                className="
                  text-[10px]
                  text-slate-400
                  uppercase
                  tracking-widest
                  mb-2
                  font-semibold
                "
              >
                {callState ===
                    CALL_STATUS.RINGING ||
                callState === "RINGING"
                  ? "Ringing Customer..."
                  : "Call Connected"}
              </div>

              <div
                className="
                  text-4xl
                  font-bold
                  font-mono
                  text-white
                  tracking-wider
                  mb-2
                "
              >
                {formatTime()}
              </div>

              <div
                className="
                  text-[11px]
                  font-mono
                  text-emerald-400/80
                  mt-1
                "
              >
                {phoneNumber}
              </div>

              {currentCallId && (
                <div
                  className="
                    text-[9px]
                    font-mono
                    text-slate-500
                    mt-2
                    break-all
                    px-4
                  "
                >
                  ID: {currentCallId}
                </div>
              )}
            </div>

            {/* ================================================= */}
            {/* HANG UP */}
            {/* ================================================= */}

            <div
              className="
                mt-4
                pt-2
                border-t
                border-slate-800/50
              "
            >
              <button
                onClick={handleHangUp}
                disabled={
                  hangupInProgressRef.current
                }
                className="
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-2
                  py-3
                  rounded-2xl
                  bg-rose-600
                  hover:bg-rose-700
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  text-white
                  font-bold
                  text-xs
                  transition-colors
                  shadow-lg
                  shadow-rose-600/20
                "
              >
                <PhoneOff className="w-4 h-4" />

                <span>
                  HANG UP
                </span>
              </button>
            </div>
          </>
        )}

        {/* ================================================= */}
        {/* MESSAGE */}
        {/* ================================================= */}

        {uiMessage && (
          <div
            className="
              mt-3
              p-2
              bg-slate-800/80
              text-amber-400
              rounded-xl
              text-[10px]
              text-center
              font-medium
              border
              border-amber-500/20
            "
          >
            {uiMessage}
          </div>
        )}

        {/* ================================================= */}
        {/* BOTTOM LINE */}
        {/* ================================================= */}

        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            h-1
            bg-slate-800
          "
        >
          <div
            className={`
              h-full
              w-1/3
              rounded-r-full
              transition-colors
              duration-300
              ${
                isCallActive
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }
            `}
          />
        </div>
      </div>
    </Draggable>
  );
};

export default FloatingMakeCall;


