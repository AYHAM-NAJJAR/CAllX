import { useState } from 'react';
import { FileAudio, Trash2 } from 'lucide-react';

export default function MenuSideProperties({ node, setNodes }) {
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
        <h3 className="text-sky-400 font-bold">Main Menu Settings</h3>
        <button className='bg-sky-400 rounded-lg cursor-pointer font-bold text-black px-2 hover:bg-sky-300 transition-all'>Save</button>
      </div>
      
      <div>
        <label className="block text-xs text-slate-400 mb-1">Prompt Text</label>
        <textarea
          className="w-full bg-slate-800 text-white p-2 rounded border border-slate-600"
          value={data.promptText || ''}
          onChange={(e) => updateNodeData({ ...data, promptText: e.target.value })}
        />
      </div>

      {/* حقل الصوت الجديد */}
      <div>
        <label className="block text-xs text-slate-400 mb-1">Audio Prompt</label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) updateNodeData({ ...data, audioUrl: URL.createObjectURL(file) });
          }}
          className="w-full text-sm text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-sky-900 file:text-sky-200"
        />
        {data.audioUrl && (
          <div className="mt-2 flex items-center justify-between bg-slate-800 p-2 rounded text-xs text-sky-400">
            <span className="flex items-center gap-2"><FileAudio size={14} /> Audio attached</span>
            <button onClick={() => updateNodeData({ ...data, audioUrl: null })}><Trash2 size={14} /></button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Timeout (s)</label>
          <input
            type="number"
            className="w-full bg-slate-800 text-white p-2 rounded border border-slate-600"
            value={data.timeoutSeconds}
            onChange={(e) => updateNodeData({ ...data, timeoutSeconds: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Max Retries</label>
          <input
            type="number"
            className="w-full bg-slate-800 text-white p-2 rounded border border-slate-600"
            value={data.maxRetries}
            onChange={(e) => updateNodeData({ ...data, maxRetries: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-2">Options</label>
        {data.options.map((opt, index) => (
          <div key={index} className="bg-slate-800 p-3 rounded mb-2 border border-slate-700 flex gap-2">
            <input className="w-12 bg-slate-700 p-1 rounded text-center" value={opt.dtmfKey} onChange={(e) => {
              const newOpts = [...data.options];
              newOpts[index].dtmfKey = e.target.value;
              updateNodeData({ ...data, options: newOpts });
            }} />
            <input className="flex-grow bg-slate-700 p-1 rounded px-2" value={opt.label} onChange={(e) => {
              const newOpts = [...data.options];
              newOpts[index].label = e.target.value;
              updateNodeData({ ...data, options: newOpts });
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}