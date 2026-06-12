import { useState } from 'react';
import { FileAudio, Trash2 } from 'lucide-react';

export default function VoicemailSideProperties({ node, setNodes }) {
  const [data, setData] = useState(node.data);

  const updateNodeData = (newData) => {
    setData(newData);
    setNodes((nds) =>
      nds.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, ...newData } } : n))
    );
  };

  return (
    <div className="p-6 space-y-4">
      <div className='flex justify-between flex-row items-center'>
        <h3 className="text-purple-400 font-bold ">Voicemail Settings</h3>
        <button className='bg-purple-400 rounded-lg cursor-pointer font-bold text-black px-2 hover:bg-purple-300  transition-all ease-in'>Save</button>
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Intro Prompt</label>
        <textarea
          className="w-full bg-slate-800 p-2 rounded border border-slate-600 text-white"
          value={data.promptText || ''}
          onChange={(e) => updateNodeData({ ...data, promptText: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Max Duration (s)</label>
          <input
            type="number"
            className="w-full bg-slate-800 p-2 rounded border border-slate-600 text-white"
            value={data.timeoutSeconds}
            onChange={(e) => updateNodeData({ ...data, timeoutSeconds: parseInt(e.target.value) })}
          />
        </div>
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
    </div>
  );
}