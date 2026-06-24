import { useEffect, useState, useCallback } from 'react';
import CreateFlowModal from './Modal/CreateFlowModal';

import FlowCard from './components/FlowCard';
import { allFlows } from '../../../services/call/IVR/Flow/getAllFlows';
import LoadingCircle from '../../../components/common/LoadingCircle';
import LoadingError from '../../../components/common/LoadingError';
import UpdateFlowModal from './Modal/UpdateFlowModal';

function AllFlows() {
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("Token");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState("");

  const refreshFlows = useCallback(async () => {
    if (!token) return;
    try {
      const data = await allFlows(token);
      setFlows(data);
    } catch (err) {
      setError(true);
      console.error(err);
    }
  }, [token]);

  
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      await refreshFlows();
      setLoading(false);
    };

    fetchInitialData();
  }, [refreshFlows]);

  if (loading) {
    return <LoadingCircle Phrase={"Flows"} />;
  }

  if (error) {
    return <LoadingError Phrase={"Flows"} />;
  }
      function openUpdate(flow) {
        setSelectedFlow(flow);
        
        setIsUpdateModalOpen(true)
      }
  return (
    <>
      {/* قمنا بتمرير دالة التحديث للمودال هنا */}
      <CreateFlowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshFlows} 
      />
        {isUpdateModalOpen && (
        <UpdateFlowModal
          isOpen={isUpdateModalOpen}
          flowData={selectedFlow}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedFlow(""); 
          }}
          onSuccess={refreshFlows}
        />
        )}
      <div className="max-w-6xl p-6 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl text-white font-bold">IVR Flows</h1>
            <p className="text-slate-100">Manage your automated call flows from here.</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-customButton text-slate-50 px-6 py-2 rounded-lg font-semibold transition"
          >
            Add New Flow
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {flows.map((flow) => (
            <FlowCard 
            key={flow.id}
            flow={flow} 
            openUpdate={openUpdate}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default AllFlows;