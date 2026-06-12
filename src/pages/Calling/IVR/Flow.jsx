import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateFlowModal from './Modal/CreateFlowModal';

function Flow() {
  // مصفوفة تحتوي على فلو واحد تجريبي مطابق لهيكل الركوست
  const [flows, setFlows] = useState([
    {
      id: '1',
      name: 'Basic call',
      description: 'Main IVR menu',
      active: true,
      rootNodeId: null
    }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary p-8 text-white">
      {/* تمرير الدالة الصحيحة لإغلاق المودال */}
      <CreateFlowModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">IVR Flows</h1>
            <p className="text-slate-400">Manage your automated call flows from here.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-customButton px-6 py-2 rounded-lg font-semibold transition"
          >
            Add New Flow
          </button>
        </div>

        {/* شبكة عرض الـ Flows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {flows.map(flow => (
            <div 

              key={flow.id} 
              className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-indigo-500 transition cursor-pointer"
              onClick={() => navigate("/ivrcatalog")}
            >
              <h3 className="text-xl font-bold mb-2">{flow.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{flow.description}</p>
              <span className={`px-2 py-1 rounded text-xs ${flow.active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                {flow.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Flow;