import { useEffect, useState } from 'react';
import { FileAudio, Trash2 } from 'lucide-react';
import Button from '../../../../components/common/Button';
import { createHangUpNode } from '../../../../services/call/IVR/Node/CreateHangUpNode';

export default function HangupSideProperties({ node,  flowId ,setNodes }) {
  const [data, setData] = useState(node.data);
  const token = localStorage.getItem('Token');
  const updateNodeData = (newData) => {
    setData(newData);
    setNodes((nds) =>
      nds.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, ...newData } } : n))
    );
  };
  useEffect(() => {
      console.log("😁DATA CHANGED", data);
    }, [data]);
    async function handleCreateHangUpNode() {
      const payload = {
        type: 'HANGUP',
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
  
      const response = await createHangUpNode(
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
      <div className='flex flex-row items-center justify-between'>
          <h3 className="text-red-500 font-bold ">Hangup Settings</h3>
      <Button
      onClick={handleCreateHangUpNode} 
      className='bg-red-500 rounded-lg cursor-pointer font-bold text-black px-2 hover:bg-red-400 transition-all'>Save</Button>
      </div>
    
      <div>
        <label className="block text-xs text-slate-400 mb-1">Goodbye Prompt</label>
        <textarea
          className="w-full bg-slate-800 p-2 rounded border border-slate-600 text-white"
          value={data.promptText || ''}
          onChange={(e) => updateNodeData({ ...data, promptText: e.target.value })}
        />
      </div>

      {/* حقل تحميل الصوت */}
      <div>
        <label className="block text-xs text-slate-400 mb-1">Audio File</label>
        <div className="flex items-center gap-2">
            <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const url = URL.createObjectURL(file);
                        updateNodeData({ ...data, audioUrl: url });
                    }
                }}
                className="text-sm text-slate-400 w-full cursor-pointer file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-red-900 file:text-red-200 hover:file:bg-red-800"
            />
        </div>
        {data.audioUrl && (
            <div className="mt-2 flex items-center justify-between bg-slate-800 p-2 rounded text-xs">
                <div className="flex items-center gap-2 text-red-400">
                    <FileAudio size={14} />
                    <span>Audio attached</span>
                </div>
                <button 
                    onClick={() => updateNodeData({ ...data, audioUrl: null })}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                >
                    <Trash2 size={14} />
                </button>
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