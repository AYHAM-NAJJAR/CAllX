import { useEffect, useState } from 'react';
import { createTransferNode } from '../../../../services/call/IVR/Node/CreateTransferNode';
import Button from '../../../../components/common/Button';


export default function TransferSideProperties({ node, setNodes , flowId }) {
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
  async function handleCreateTransferNode() {
      const payload = {
        type: 'TRANSFER',
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
  
      const response = await createTransferNode(
        payload,
        flowId,
        token
      );
  
      if (response) {
        console.log('🙌 Node Created:', response);
        console.log(response.data.id);
        // حفظ dbId داخل React Flow node
        updateNodeData({
          ...data,
          dbId: response.data.id,
        });
        
      }
    }
  
  return (
    <div className="p-6 space-y-4">
      <div className='flex flex-row items-center justify-between'>
        <h3 className="text-emerald-400 font-bold ">Transfer Settings</h3>
        <Button 
        onClick={handleCreateTransferNode}
        className='bg-emerald-400 rounded-lg cursor-pointer font-bold text-black px-2 hover:bg-emerald-300  transition-all ease-in'>Save</Button>
      </div>
      

      {/* <div>
        <label className="block text-xs text-slate-400 mb-1">Target Agent</label>
        <input
          className="w-full bg-slate-800 p-2 rounded border border-slate-600 text-white"
          value={data.transferTarget || ''}
          onChange={(e) => updateNodeData({ ...data, transferTarget: e.target.value })}
        />
      </div> */}

      <div>
        <label className="block text-xs text-slate-400 mb-1">Prompt Text</label>
        <textarea
          className="w-full bg-slate-800 p-2 rounded border border-slate-600 text-white"
          value={data.promptText || ''}
          onChange={(e) => updateNodeData({ ...data, promptText: e.target.value })}
        />
      </div>

      {/* حقل الصوت */}
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
                className="text-sm text-slate-400 w-full cursor-pointer file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-emerald-900 file:text-emerald-200 hover:file:bg-emerald-800"
            />
        </div>
        {data.audioUrl && (
            <div className="mt-2 flex items-center gap-2 text-emerald-400 text-xs">
                
                <span>Audio attached</span>
                <button 
                    onClick={() => updateNodeData({ ...data, audioUrl: null })}
                    className="text-red-400 hover:underline ml-2"
                >Remove</button>
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