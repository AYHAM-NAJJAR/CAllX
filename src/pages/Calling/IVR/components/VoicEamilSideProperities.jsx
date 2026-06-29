import { useEffect, useState } from 'react';
import { FileAudio, Trash2 } from 'lucide-react';
import Button from '../../../../components/common/Button';
import { createVoiceEmailNode } from '../../../../services/call/IVR/Node/CreateVoiceEmailNode';

export default function VoicemailSideProperties({ node, flowId, setNodes }) {
  const [data, setData] = useState(node.data);
  const token = localStorage.getItem('Token');
  const updateNodeData = (newData) => {
    setData(newData);
    setNodes((nds) =>
      nds.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, ...newData } } : n))
    );
  };
  

      async function handleCreateHangUpNode() {
        const payload = {
          type: 'VOICEMAIL',
          promptText: data.promptText,
          // audioUrl: data.audioUrl ?? null,
          timeoutSeconds: data.timeoutSeconds,
          maxRetries: data.maxRetries,
          
    
          /*
           * IMPORTANT:
           * لا نرسل options أثناء الإنشاء.
           *
           * السبب:
           * React Flow يستخدم UUIDs بينما الـ Backend يحتاج DB IDs.
           *
           * بعد إنشاء جميع الـ Nodes والحصول على dbId لكل Node
           * سيتم بناء options من الـ edges ثم إرسالها عبر Update API.
           *
           * options: data.options.map((opt) => {
           *   const edge = edges.find(
           *     (e) =>
           *       e.source === node.id &&
           *       e.sourceHandle === String(opt.id)
           *   );
           *
           *   return {
           *     dtmfKey: opt.dtmfKey,
           *     label: opt.label,
           *     targetNodeId: ??? // dbId لاحقاً
           *   };
           * })
           */
        };
    
        console.log('Create Payload:', payload);
    
        const response = await createVoiceEmailNode(
          payload,
          flowId,
          token
        );
    
        if (response) {
          console.log('🙌 Node Created:', response);
    
          // حفظ dbId داخل React Flow node
          updateNodeData({
            ...data,
            dbId: response.data.id,
          });
          
        }
      }
    
      /*
       * مؤقتاً لم نعد نستخدم هذا الشرط
       * لأن حفظ العقدة أصبح مستقلاً عن حفظ العلاقات.
       *
       * لاحقاً قد تحتاجه عند Save Flow.
       */
      /*
      const allOptionsConnected = data.options.every((opt) =>
        edges.some(
          (e) =>
            e.source === node.id &&
            e.sourceHandle === String(opt.id)
        )
      );
      */
    
      /*
       * لا تحذف هذا الكود.
       * سنحتاجه لاحقاً عند تفعيل إدارة الخيارات من جديد.
       */
      /*
      const addOption = () => {
        const newOption = {
          id: Date.now().toString(),
          dtmfKey: '',
          label: '',
        };
    
        updateNodeData({
          ...data,
          options: [...data.options, newOption],
        });
      };
    
      const removeOption = (index) => {
        updateNodeData({
          ...data,
          options: data.options.filter((_, i) => i !== index),
        });
      };
      */
  return (
    <div className="p-6 space-y-4">
      <div className='flex justify-between flex-row items-center'>
        <h3 className="text-purple-400 font-bold ">Voicemail Settings</h3>
        <Button
        onClick={handleCreateHangUpNode} 
        className='bg-purple-400 rounded-lg cursor-pointer font-bold text-black px-2 hover:bg-purple-300  transition-all ease-in'>Save</Button>
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Intro Prompt</label>
        <textarea
          className="w-full bg-slate-800 p-2 rounded border border-slate-600 text-white"
          value={data.promptText || ''}
          onChange={(e) => updateNodeData({ ...data, promptText: e.target.value })}
        />
      </div>


      {/* Audio Upload */}
      <div>
        <label className="block text-xs text-slate-400 mb-1">Greeting Audio</label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) updateNodeData({ ...data, audioUrl: URL.createObjectURL(file) });
          }}
          className="text-sm text-slate-400 w-full cursor-pointer file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-purple-900 file:text-purple-200"
        />
        {data.audioUrl && (
          <div className="mt-2 flex items-center justify-between bg-slate-800 p-2 rounded text-xs text-purple-400">
            <span className="flex items-center gap-2"><FileAudio size={14} /> Audio attached</span>
            <button onClick={() => updateNodeData({ ...data, audioUrl: null })}><Trash2 size={14} /></button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Timeout (s)
          </label>

          <input
            type="number"
            className="w-full bg-slate-800 text-white p-2 rounded border border-slate-600"
            value={data.timeoutSeconds}
            onChange={(e) =>
              updateNodeData({
                ...data,
                timeoutSeconds: parseInt(e.target.value),
              })
            }
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Max Retries
          </label>

          <input
            type="number"
            className="w-full bg-slate-800 text-white p-2 rounded border border-slate-600"
            value={data.maxRetries}
            onChange={(e) =>
              updateNodeData({
                ...data,
                maxRetries: parseInt(e.target.value),
              })
            }
          />
        </div>
      </div>
    </div>
  );
}