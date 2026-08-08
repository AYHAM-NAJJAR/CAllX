// /**
//  * AudioIntelligenceEngine.js
//  * Frontend Real-time Audio Analytics Layer for WebRTC / LiveKit Calls
//  */

// export class AudioIntelligenceEngine {
//   constructor(onMetricsUpdate) {
//     this.onMetricsUpdate = onMetricsUpdate;
//     this.audioCtx = null;

//     // Track Sources & Analysers
//     this.customerAnalyser = null;
//     this.agentAnalyser = null;

//     // State Tracking
//     this.isAnalyzing = false;
//     this.animationFrameId = null;

//     // Customer Metrics State
//     this.smoothedCustomerRms = 0;
//     this.customerSpeaking = false;
//     this.silenceStartTime = null;
//     this.currentSilenceDuration = 0;

//     // Agent Metrics State
//     this.agentSpeaking = false;

//     // Call Analytics Aggregates
//     this.interruptionCount = 0;
//     this.lastInterruptionTime = 0; // Debounce
//     this.timelineEvents = [];
//     this.startTime = Date.now();

//     // Call Quality Metrics Tracking
//     this.totalSilenceSeconds = 0;
//     this.highStressDurationSeconds = 0;
//     this.volumeSpikeCount = 0;

//     // Engine Configurations
//     this.config = {
//       fftSize: 2048,
//       smoothingAlpha: 0.75,       // RMS Smoothing Factor
//       speakingThresholdRms: 0.035,// VAD Threshold for Speaking
//       silenceMinSeconds: 3,       // Threshold to trigger LONG_SILENCE event
//       interruptionCooldownMs: 1500// Prevent double counting interruptions
//     };
//   }

//   /**
//    * Initialize shared AudioContext safely
//    */
//   initContext() {
//     if (!this.audioCtx) {
//       const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
//       this.audioCtx = new AudioCtxClass();
//     }
//     if (this.audioCtx.state === "suspended") {
//       this.audioCtx.resume();
//     }
//   }

//   /**
//    * Attach Customer Remote Track for Analysis
//    */
//   attachCustomerTrack(mediaStreamTrack) {
//     this.initContext();
//     const stream = new MediaStream([mediaStreamTrack]);
//     const source = this.audioCtx.createMediaStreamSource(stream);

//     this.customerAnalyser = this.audioCtx.createAnalyser();
//     this.customerAnalyser.fftSize = this.config.fftSize;

//     source.connect(this.customerAnalyser);
//     this.logEvent("CALL_STARTED", "بدأت معالجة صوت العميل");
//     this.startLoop();
//   }

//   /**
//    * Attach Agent Local Track for Interruption Detection
//    */
//   attachAgentTrack(mediaStreamTrack) {
//     this.initContext();
//     const stream = new MediaStream([mediaStreamTrack]);
//     const source = this.audioCtx.createMediaStreamSource(stream);

//     this.agentAnalyser = this.audioCtx.createAnalyser();
//     this.agentAnalyser.fftSize = this.config.fftSize;

//     source.connect(this.agentAnalyser);
//   }

//   /**
//    * Main Processing Loop (Runs ~20 times per second for smooth performance)
//    */
//   startLoop() {
//     if (this.isAnalyzing) return;
//     this.isAnalyzing = true;

//     const bufferLength = this.config.fftSize;
//     const customerBuffer = new Float32Array(bufferLength);
//     const agentBuffer = new Float32Array(bufferLength);

//     let lastTickTime = Date.now();

//     const process = () => {
//       if (!this.isAnalyzing) return;

//       const now = Date.now();
//       const deltaTime = (now - lastTickTime) / 1000; // seconds
//       lastTickTime = now;

//       // 1. Calculate Customer Audio Metrics
//       let customerRms = 0;
//       let customerZcr = 0;
//       let customerVolumePercent = 0;
//       let customerVolumeState = "LOW";

//       if (this.customerAnalyser) {
//         this.customerAnalyser.getFloatTimeDomainData(customerBuffer);
//         customerRms = this.calculateRMS(customerBuffer);
//         customerZcr = this.calculateZCR(customerBuffer);

//         // Exponential Decay Smoothing
//         this.smoothedCustomerRms =
//           this.config.smoothingAlpha * this.smoothedCustomerRms +
//           (1 - this.config.smoothingAlpha) * customerRms;

//         // Scale RMS (0.0 - 0.25 typical range) to Volume (0 - 100)
//         customerVolumePercent = Math.min(
//           100,
//           Math.round((this.smoothedCustomerRms / 0.2) * 100)
//         );

//         if (customerVolumePercent > 70) customerVolumeState = "HIGH";
//         else if (customerVolumePercent > 25) customerVolumeState = "MEDIUM";
//         else customerVolumeState = "LOW";
//       }

//       // 2. Calculate Agent Speaking State
//       let agentRms = 0;
//       if (this.agentAnalyser) {
//         this.agentAnalyser.getFloatTimeDomainData(agentBuffer);
//         agentRms = this.calculateRMS(agentBuffer);
//       }

//       const isAgentTalkingNow = agentRms > this.config.speakingThresholdRms;
//       const isCustomerTalkingNow =
//         this.smoothedCustomerRms > this.config.speakingThresholdRms;

//       // Feature 1 & 2: Stress Calculation
//       const stressData = this.detectVoiceStress(
//         this.smoothedCustomerRms,
//         customerZcr,
//         isCustomerTalkingNow
//       );

//       if (stressData.stressLevel === "HIGH" && isCustomerTalkingNow) {
//         this.highStressDurationSeconds += deltaTime;
//       }
//       if (customerVolumeState === "HIGH") {
//         this.volumeSpikeCount += 1;
//       }

//       // Feature 3: Interruption Detection Logic
//       this.handleInterruptionLogic(
//         isAgentTalkingNow,
//         isCustomerTalkingNow,
//         now
//       );

//       // Feature 4: Silence Detection Logic
//       this.handleSilenceLogic(isCustomerTalkingNow, deltaTime);

//       // Feature 6: Rule-Based Recommendation Engine
//       const recommendation = this.generateRecommendation(
//         stressData.stressLevel,
//         this.interruptionCount,
//         this.currentSilenceDuration,
//         customerVolumeState
//       );

//       // Construct Payload for UI
//       const outputData = {
//         timestamp: this.getFormattedTime(),
//         energy: {
//           volume: customerVolumePercent,
//           rms: parseFloat(this.smoothedCustomerRms.toFixed(4)),
//           state: customerVolumeState,
//         },
//         stress: stressData,
//         silence: {
//           duration: Math.round(this.currentSilenceDuration),
//           isSilent: !isCustomerTalkingNow,
//         },
//         interruptions: {
//           count: this.interruptionCount,
//         },
//         recommendation: recommendation,
//         timeline: [...this.timelineEvents],
//       };

//       if (this.onMetricsUpdate) {
//         this.onMetricsUpdate(outputData);
//       }

//       // Loop via setTimeout to throttle CPU usage to ~25Hz
//       setTimeout(() => {
//         this.animationFrameId = requestAnimationFrame(process);
//       }, 40);
//     };

//     process();
//   }

//   /**
//    * RMS (Root Mean Square) Calculation
//    */
//   calculateRMS(buffer) {
//     let sum = 0;
//     for (let i = 0; i < buffer.length; i++) {
//       sum += buffer[i] * buffer[i];
//     }
//     return Math.sqrt(sum / buffer.length);
//   }

//   /**
//    * Zero Crossing Rate (ZCR) for Pitch/Turbulence proxy
//    */
//   calculateZCR(buffer) {
//     let crossings = 0;
//     for (let i = 1; i < buffer.length; i++) {
//       if (
//         (buffer[i] >= 0 && buffer[i - 1] < 0) ||
//         (buffer[i] < 0 && buffer[i - 1] >= 0)
//       ) {
//         crossings++;
//       }
//     }
//     return crossings / buffer.length;
//   }

//   /**
//    * Feature 2: Rule-Based Voice Stress Detector
//    */
//   detectVoiceStress(rms, zcr, isSpeaking) {
//     if (!isSpeaking) {
//       return { stressLevel: "LOW", confidence: 50 };
//     }

//     // High RMS indicates shouting/intensity, high ZCR indicates high frequency/tremor
//     let stressScore = 0;

//     if (rms > 0.12) stressScore += 50;
//     else if (rms > 0.07) stressScore += 25;

//     if (zcr > 0.18) stressScore += 40; // High pitch variability
//     else if (zcr > 0.12) stressScore += 20;

//     let stressLevel = "LOW";
//     let confidence = 65;

//     if (stressScore >= 70) {
//       stressLevel = "HIGH";
//       confidence = Math.min(95, 75 + Math.round(stressScore / 5));
//     } else if (stressScore >= 35) {
//       stressLevel = "MEDIUM";
//       confidence = 75;
//     } else {
//       stressLevel = "LOW";
//       confidence = 85;
//     }

//     return { stressLevel, confidence };
//   }

//   /**
//    * Feature 3: Customer Interruption Tracker
//    */
//   handleInterruptionLogic(isAgentTalking, isCustomerTalking, now) {
//     // Interruption happens when Agent WAS talking, and Customer STARTS talking over them
//     if (
//       this.agentSpeaking &&
//       isCustomerTalking &&
//       !this.customerSpeaking &&
//       now - this.lastInterruptionTime > this.config.interruptionCooldownMs
//     ) {
//       this.interruptionCount++;
//       this.lastInterruptionTime = now;

//       this.logEvent(
//         "INTERRUPTION",
//         `العميل قاطع الوكيل (المقاطعة رقم ${this.interruptionCount})`
//       );
//     }

//     this.agentSpeaking = isAgentTalking;
//     this.customerSpeaking = isCustomerTalking;
//   }

//   /**
//    * Feature 4: Silence Tracker
//    */
//   handleSilenceLogic(isCustomerSpeaking, deltaTime) {
//     if (!isCustomerSpeaking) {
//       this.currentSilenceDuration += deltaTime;
//       this.totalSilenceSeconds += deltaTime;

//       // Fire Long Silence Event once threshold crossed
//       if (
//         this.currentSilenceDuration >= this.config.silenceMinSeconds &&
//         !this.hasLoggedSilence
//       ) {
//         this.logEvent("LONG_SILENCE", `صمت طويل من العميل (${Math.round(this.currentSilenceDuration)} ثوانٍ)`);
//         this.hasLoggedSilence = true;
//       }
//     } else {
//       this.currentSilenceDuration = 0;
//       this.hasLoggedSilence = false;
//     }
//   }

//   /**
//    * Feature 5: Timeline Event Logger
//    */
//   logEvent(type, text) {
//     const event = {
//       id: Date.now(),
//       time: this.getFormattedTime(),
//       type: type,
//       description: text,
//     };
//     this.timelineEvents.unshift(event); // Newest first
//     if (this.timelineEvents.length > 20) this.timelineEvents.pop(); // Keep last 20
//   }

//   /**
//    * Feature 6: Rule-Based Recommendation Engine
//    */
//   generateRecommendation(stressLevel, interruptions, silenceDuration, volumeState) {
//     if (stressLevel === "HIGH" || volumeState === "HIGH") {
//       return "حافظ على نبرة هادئة وامتص غضب العميل وكن متفهماً.";
//     }
//     if (interruptions >= 3) {
//       return "العميل يحاول الشرح، دع العميل يكمل حديثه دون مقاطعة.";
//     }
//     if (silenceDuration >= 4) {
//       return "صمت طويل من العميل، اسأله: هل تسمعني بشكل واضح؟";
//     }
//     return "سير المحادثة ممتازة، واصل استماعك الفعال للعميل.";
//   }

//   /**
//    * Feature 7: Post-Call Quality Score Evaluator
//    */
//   calculateFinalCallQuality() {
//     let score = 100;
//     const summary = [];

//     // Deductions based on analytics
//     if (this.interruptionCount > 0) {
//       const deduction = Math.min(25, this.interruptionCount * 7);
//       score -= deduction;
//       summary.push(`تم تسجيل ${this.interruptionCount} مقاطعة أثناء الحديث.`);
//     } else {
//       summary.push("تدفق حديث ممتاز بدون مقاطعات.");
//     }

//     if (this.highStressDurationSeconds > 10) {
//       score -= 20;
//       summary.push("تم رصد مؤشرات توتر/انفعال عالية من العميل لمدد متكررة.");
//     } else {
//       summary.push("نبرة صوت العميل متوازنة ومستقرة غالباً.");
//     }

//     if (this.totalSilenceSeconds > 20) {
//       score -= 15;
//       summary.push("وجود فترات صمت توقف طويلة أثرت على انسيابية المكالمة.");
//     }

//     return {
//       qualityScore: Math.max(0, Math.round(score)),
//       summary: summary,
//       stats: {
//         totalInterruptions: this.interruptionCount,
//         totalSilenceSeconds: Math.round(this.totalSilenceSeconds),
//         highStressDurationSeconds: Math.round(this.highStressDurationSeconds)
//       }
//     };
//   }

//   /**
//    * Helper: Get current call duration MM:SS
//    */
//   getFormattedTime() {
//     const elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
//     const mins = Math.floor(elapsedSeconds / 60).toString().padStart(2, "0");
//     const secs = (elapsedSeconds % 60).toString().padStart(2, "0");
//     return `${mins}:${secs}`;
//   }

//   /**
//    * Cleanup Engine on Disconnect
//    */
//   destroy() {
//     this.isAnalyzing = false;
//     if (this.animationFrameId) {
//       cancelAnimationFrame(this.animationFrameId);
//     }
//     if (this.audioCtx) {
//       this.audioCtx.close();
//       this.audioCtx = null;
//     }
//   }
// }