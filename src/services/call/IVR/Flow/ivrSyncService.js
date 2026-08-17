// src/services/ivrSyncService.js

import { updateNode } from '../Node/UpdateNode';
import { updateFlow } from './updateFlow'; // تأكد من المسار

// 1. أضفنا flowId و flowData كمعاملات (Parameters) للدالة
export const saveCompleteFlow = async (flowId, flowData, nodes, edges) => {
  const token = localStorage.getItem('Token');
  console.log(nodes);
  console.log(edges);

  const unsavedNodes = nodes.filter((node) => !node.data?.dbId);
  if (unsavedNodes.length > 0) {
    const errorMsg = "يوجد عقد غير محفوظة في قاعدة البيانات. تأكد من عمل Save (Create) لكل عقدة جديدة أولاً.";
    console.error(errorMsg, unsavedNodes);
    alert(errorMsg);
    return;
  }

  // ==========================================
  // النقص الذي تمت إضافته: استخراج rootNodeId
  // ==========================================
  // نبحث عن عقدة من نوع main-menu ليس لها أي سهم يدخل إليها (Target)
  let rootNode = nodes.find(
    (node) => node.type === 'main-menu' && !edges.some((edge) => edge.target === node.id)
  );

  // إذا لم نجدها بهذه الطريقة (لو كان هناك main-menu واحدة فقط)، نأخذ أول main-menu نجدها
  if (!rootNode) {
    rootNode = nodes.find((node) => node.type === 'main-menu');
  }

  if (!rootNode || !rootNode.data?.dbId) {
    alert("لم يتم العثور على عقدة القائمة الرئيسية (Main Menu) لتعيينها كجذر للمخطط.");
    return;
  }

  const rootNodeId = rootNode.data.dbId;
  console.log("Root Node ID:", rootNodeId);
  // ==========================================

  const updatePromises = [];

  // 2. معالجة كل عقدة وبناء الـ Payload الخاص بها
  for (const node of nodes) {
    const dbId = node.data.dbId;
    let updatePayload = {};

    switch (node.type) {
      case 'main-menu': {
        const updatedOptions = (node.data.options || []).map((opt, index) => {
          const edge = edges.find(
            (e) => e.source === node.id && e.sourceHandle === String(opt.id || index)
          );

          let targetDbId = null;
          if (edge) {
            const targetNode = nodes.find((n) => n.id === edge.target);
            targetDbId = targetNode?.data?.dbId || null;
          }

          return {
            dtmfKey: opt.dtmfKey,
            label: opt.label,
            targetNodeId: targetDbId, 
          };
        }).filter(opt => opt.targetNodeId !== null);

        updatePayload = {
          type: "MENU",
          promptText: node.data.promptText || "",
          audioUrl: node.data.audioUrl || null,
          timeoutSeconds: node.data.timeoutSeconds,
          maxRetries: node.data.maxRetries,
          transferTarget: "sales-queue",
          options: updatedOptions,
        };
        console.log("soso", updatedOptions);
        break;
      }

      case 'transfer': {
        updatePayload = {
          type: "TRANSFER",
          promptText: node.data.promptText || "",
          audioUrl: null,
          timeoutSeconds: node.data.timeoutSeconds,
          maxRetries: node.data.maxRetries,
          transferTarget: "sales-queue",
        };
        break;
      }

      case 'hangup': {
        updatePayload = {
          type: "HANGUP",
          promptText: node.data.promptText || "",
          audioUrl: node.data.audioUrl || null,
          timeoutSeconds: node.data.timeoutSeconds,
          maxRetries: node.data.maxRetries,
          transferTarget: "sales-queue",
          options: []
        };
        break;
      }

      case 'voice': {
        updatePayload = {
          type: "VOICEMAIL",
          promptText: node.data.promptText || "",
          audioUrl: node.data.audioUrl || null,
          timeoutSeconds: node.data.timeoutSeconds,
          maxRetries: node.data.maxRetries,
          transferTarget: "sales-queue",
          options: []
        };
        break;
      }

      default:
        console.warn(`تم تخطي العقدة غير المعروفة: ${node.type}`);
        continue; // تخطي هذه الدورة من اللوب بدون إضافة Promise
    }
    
    const requestPromise = updateNode(dbId, updatePayload, token);
    updatePromises.push(requestPromise);
  }

  // 4. تنفيذ جميع الطلبات دفعة واحدة (Parallel Processing)
  try {
    console.log("جاري حفظ المخطط وتحديث العقد...");
    
    // 1. تحديث جميع العقد أولاً
    await Promise.all(updatePromises);
    console.log(flowId, flowData, rootNodeId, token);
    // 2. بعد نجاح تحديث العقد، نقوم بتحديث الفلو ونمرر له الـ rootNodeId
    await updateFlow(flowId, flowData, rootNodeId, token);
    
    console.log("✅ تمت عملية حفظ المخطط بنجاح.");
    alert("تم حفظ المخطط وتحديث جميع العلاقات بنجاح!");

  } catch (error) {
    console.error("💥 حدث خطأ أثناء حفظ المخطط:", error);
    alert("حدث خطأ أثناء حفظ المخطط. الرجاء مراجعة الـ Console.");
  }
};