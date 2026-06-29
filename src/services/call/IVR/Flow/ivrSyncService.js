// src/services/ivrSyncService.js

// 1. استيراد دالة الـ API التي تم عزلها
import { updateNode } from '../Node/UpdateNode';


export const saveCompleteFlow = async (nodes, edges) => {
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

  const updatePromises = [];

  // 2. معالجة كل عقدة وبناء الـ Payload الخاص بها
  for (const node of nodes) {
    const dbId = node.data.dbId;
    let updatePayload = {};

    switch (node.type) {
      case 'main-menu': {
        // بناء خيارات القائمة وتتبع مسار الأسهم لمعرفة العقدة الهدف
        const updatedOptions = (node.data.options || []).map((opt, index) => {
          // البحث عن السهم الذي يخرج من هذا الخيار
          const edge = edges.find(
            (e) => e.source === node.id && e.sourceHandle === String(opt.id || index)
          );

          let targetDbId = null;
          if (edge) {
            // البحث عن العقدة المستهدفة لجلب dbId الخاص بها
            const targetNode = nodes.find((n) => n.id === edge.target);
            targetDbId = targetNode?.data?.dbId || null;
          }

          return {
            dtmfKey: opt.dtmfKey,
            label: opt.label,
            targetNodeId: targetDbId, // الـ ID الفعلي من قاعدة البيانات
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
        console.log("soso",updatedOptions);
        break;
      }

      case 'transfer': {
        updatePayload = {
          type: "TRANSFER",
          promptText: node.data.promptText || "",
          audioUrl:null,
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
        continue;
    }
    const requestPromise = updateNode(dbId, updatePayload, token);
    
    updatePromises.push(requestPromise);
  }

  // 4. تنفيذ جميع الطلبات دفعة واحدة (Parallel Processing)
  try {
    console.log("جاري حفظ المخطط...");
    
    // تنفيذ جميع الوعود بالتوازي لأداء أسرع
    await Promise.all(updatePromises);

    console.log("✅ تمت عملية حفظ المخطط بنجاح.");
    alert("تم حفظ المخطط وتحديث جميع العلاقات بنجاح!");

  } catch (error) {
    console.error("💥 حدث خطأ أثناء حفظ المخطط:", error);
    alert("حدث خطأ أثناء حفظ المخطط. الرجاء مراجعة الـ Console.");
  }
};