import { useEffect, useState } from 'react';
import { FileAudio, Trash2 } from 'lucide-react';
import Button from '../../../../components/common/Button';
import { createMenueNode } from '../../../../services/call/IVR/Node/CreateMenuNode';

export default function MenuSideProperties({
  node,
  setNodes,
  flowId,
}) {
  const [data, setData] = useState(node.data);
  const token = localStorage.getItem('Token');

  const updateNodeData = (newData) => {
    setData(newData);

    setNodes((nds) =>
      nds.map((n) =>
        n.id === node.id
          ? {
              ...n,
              data: {
                ...n.data,
                ...newData,
              },
            }
          : n
      )
    );
  };
  useEffect(() => {
    console.log("😁DATA CHANGED", data);
  }, [data]);
  async function handleCreateMenueNode() {
    const payload = {
      type: 'MENU',
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

    const response = await createMenueNode(
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
    <div className='p-8'>
      <div className="flex justify-between items-center mb-4 ">
        <h3 className="text-lg font-bold text-white">
          Main Menu
        </h3>

        <Button onClick={handleCreateMenueNode}>
          Save
        </Button>
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">
          Prompt Text
        </label>

        <textarea
          className="w-full bg-slate-800 text-white p-2 rounded border border-slate-600"
          value={data.promptText || ''}
          onChange={(e) =>
            updateNodeData({
              ...data,
              promptText: e.target.value,
            })
          }
        />
      </div>

      <div className="mt-4">
        <label className="block text-xs text-slate-400 mb-1">
          Audio Prompt
        </label>

        <input
          type="file"
          accept="audio/*"
          onChange={(e) => {
            const file = e.target.files[0];

            if (file) {
              updateNodeData({
                ...data,
                audioUrl: URL.createObjectURL(file),
              });
            }
          }}
          className="w-full text-sm text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-sky-900 file:text-sky-200"
        />

        {data.audioUrl && (
          <div className="mt-2 flex items-center justify-between bg-slate-800 p-2 rounded text-xs text-sky-400">
            <span className="flex items-center gap-2">
              <FileAudio size={14} />
              Audio attached
            </span>

            <button
              onClick={() =>
                updateNodeData({
                  ...data,
                  audioUrl: null,
                })
              }
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

      <div className="mt-4">
        {/*
          ========================================
          OPTIONS SECTION
          ========================================

          لا تحذف هذا الجزء.

          حالياً تم تعطيله لأن:
          - Create Node لا يحتاج options.
          - options سيتم إرسالها لاحقاً عبر Update API.

          عند تنفيذ Save Flow:
          1. نقرأ edges.
          2. نحول UUID => dbId.
          3. نبني options.
          4. نستدعي Update Node.

        */}

        {/*
        <button
          type="button"
          onClick={addOption}
          className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded text-xs"
        >
          Add Option
        </button>

        {data.options.map((opt, index) => (
          <div
            key={opt.id || index}
            className="bg-slate-800 p-3 rounded mb-2 border border-slate-700 flex gap-2 items-center"
          >
            <input
              className="w-12 bg-slate-700 p-1 rounded text-center"
              placeholder="Key"
              value={opt.dtmfKey}
              onChange={(e) => {
                const newOpts = [...data.options];
                newOpts[index].dtmfKey = e.target.value;

                updateNodeData({
                  ...data,
                  options: newOpts,
                });
              }}
            />

            <input
              className="flex-grow bg-slate-700 p-1 rounded px-2"
              placeholder="Label"
              value={opt.label}
              onChange={(e) => {
                const newOpts = [...data.options];
                newOpts[index].label = e.target.value;

                updateNodeData({
                  ...data,
                  options: newOpts,
                });
              }}
            />

            <button
              type="button"
              onClick={() => removeOption(index)}
              className="text-red-500 hover:text-red-300"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        */}
      </div>
    </div>
  );
}