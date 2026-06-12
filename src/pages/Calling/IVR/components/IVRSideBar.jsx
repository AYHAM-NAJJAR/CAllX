import { CirclePlus } from 'lucide-react';
import { useState } from 'react';

export default function IVRSideBar({ setNodes}) {
    
  const handleAddNode = (type) => {
    // 1. إضافة الـ Node
    const uniqueId = crypto.randomUUID();
    const data = type === 'main-menu' 
      ? { label: 'Main Menu', options: [{ id: '1', label: 'Press 1' }, { id: '2', label: 'Press 2' }] }
      : { };

    const newNode = {
      id: `${type}-${uniqueId}`,
      type: type, 
      position: { x: 100, y: 100 },
      data: data,
    };
    
    setNodes((nds) => [...nds, newNode]);

   
  };

  const nodeTypesList = ['main-menu', 'transfer', 'hangup', 'voice'];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 p-6 flex flex-col gap-4 border-r border-slate-800 shadow-xl z-10">
        <div className='flex flex-row items-center justify-center'>
            <p className='font-bold text-lg'>IVR System</p>
        </div>
      <div className="flex flex-col w-30 gap-2">
       
        {nodeTypesList.map((type) => (
          
            
            <button
            key={type}
            onClick={() => handleAddNode(type)} // استدعاء الدالة المدمجة
            className="p-3  flex items-center justify-between gap-2 bg-slate-800 hover:scale-105 transition-all duration-300 rounded-lg transition text-left text-sm"
          >
            
            {type}
            <CirclePlus className='text-sky-600' />
          </button>
          
        ))}
      </div>
    </aside>
  );
}