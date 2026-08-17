import { useEffect, useState, useCallback } from 'react';
import CreateFlowModal from './Modal/CreateFlowModal';
import FlowCard from './components/FlowCard';
import { allFlows } from '../../../services/call/IVR/Flow/getAllFlows';
import LoadingCircle from '../../../components/common/LoadingCircle';
import LoadingError from '../../../components/common/LoadingError';
import UpdateFlowModal from './Modal/UpdateFlowModal';
import { useOutletContext } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Button from '../../../components/common/Button';
import { useTranslation } from 'react-i18next';

function AllFlows() {
  const { t } = useTranslation();
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("Token");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState("");
  const context = useOutletContext() || {};
  const { toggleSidebar } = context;

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
    return <LoadingCircle Phrase={t('flowsManagement.loadingPhrase')} />;
  }

  if (error) {
    return <LoadingError Phrase={t('flowsManagement.errorPhrase')} />;
  }

  function openUpdate(flow) {
    setSelectedFlow(flow);
    setIsUpdateModalOpen(true);
  }

  return (
    <>
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
      <div className="max-w-6xl p-10 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className='flex items-start justify-start'>
            <Button 
              onClick={toggleSidebar} 
              className="p-2 text-slate-300 hover:text-sky-400 rounded-lg transition-all shrink-0"
              aria-label="Toggle Sidebar"
            >
              <Menu size={20} />
            </Button>
            <div className='flex flex-col'>
              <h1 className="text-3xl text-white font-bold">{t('flowsManagement.title')}</h1>
              <p className="text-slate-100">{t('flowsManagement.subtitle')}</p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-customButton text-slate-50 px-6 py-2 rounded-lg font-semibold transition"
          >
            {t('flowsManagement.addNewFlow')}
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