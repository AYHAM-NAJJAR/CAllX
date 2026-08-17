import React, { useState, useEffect } from 'react';
import WorkFlowCard from './components/WorkFlowCard';
import { allRules } from '../../services/workflowEngine/getAllActiveRules';
import Button from '../../components/common/Button';
import { Outlet, useLocation, useOutletContext } from 'react-router-dom';
import LoadingError from '../../components/common/LoadingError';
import LoadingCircle from '../../components/common/LoadingCircle';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GetAllWorkFlowEngines = () => {
  const { t } = useTranslation();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const isSubCreate = location.pathname.includes("/main/workengine/");
  const context = useOutletContext() || {};
  const { toggleSidebar } = context;

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('Token') || ''; 
        const data = await allRules(token);
        setWorkflows(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkflows();
  }, [location.pathname]);

  if (isSubCreate) {
    return <Outlet />;
  }
  
  if (loading) {
    return <LoadingCircle Phrase={t('workflowsManagement.loadingPhrase')} />;
  }

  if (error) {
    return <LoadingError Phrase={t('workflowsManagement.errorPhrase')} />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 md:p-8 lg:p-12">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 sm:gap-6 mb-6 sm:mb-8">
        
        {/* Left Side: Professional Menu Icon & Title */}
        <div className='flex items-center gap-3 sm:gap-4 w-full sm:w-auto'>
          <Button 
            onClick={toggleSidebar} 
            className="p-2 sm:p-2.5 bg-[#101B22] border border-slate-800 text-slate-300 hover:text-[#0D9EF2] hover:bg-slate-800/50 rounded-lg transition-all shrink-0 shadow-sm flex items-center justify-center"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
          <div className='flex flex-col'>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
              {t('workflowsManagement.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 sm:mt-1">
              {t('workflowsManagement.subtitle')}
            </p>
          </div>
        </div>
        
        {/* Right Side: Action Button */}
        <Button 
          path={"/main/workengine/create"}
          className="w-full sm:w-auto bg-customButton inline-flex items-center justify-center px-4 py-2.5 sm:py-2 text-sm sm:text-base font-medium text-white rounded-lg shadow-sm transition-all duration-200 hover:brightness-110 active:scale-95"
        >
          {t('workflowsManagement.createWorkflow')}
        </Button>
      </div>

      {/* Main Content Area */}
      <div>
        {!loading && !error && (
          workflows?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {workflows.map((workflow) => (
                <WorkFlowCard 
                  key={workflow.id} 
                  workflow={workflow} 
                  onDetailsClick={(id) => console.log(id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-20 text-slate-500 border border-dashed border-slate-800 rounded-2xl mx-2 sm:mx-0">
              <p className="text-base sm:text-lg">{t('workflowsManagement.noWorkflows')}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GetAllWorkFlowEngines;