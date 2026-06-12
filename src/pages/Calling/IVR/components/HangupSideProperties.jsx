import { useState } from 'react';
import { FileAudio, Trash2 } from 'lucide-react';

export default function HangupSideProperties({ node, setNodes }) {
  const [data, setData] = useState(node.data);

  const updateNodeData = (newData) => {
    setData(newData);
    setNodes((nds) =>
      nds.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, ...newData } } : n))
    );
  };

  return (
    <div className="p-6 space-y-4">
      <div className='flex flex-row items-center justify-between'>
          <h3 className="text-red-500 font-bold ">Hangup Settings</h3>
      <button className='bg-red-500 rounded-lg cursor-pointer font-bold text-black px-2 hover:bg-red-400 transition-all'>Save</button>
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
    </div>
  );
}