import { useEffect, useState, useCallback } from 'react';
import { getAllTenants } from '../../services/Tenants/getAllTenants';
import TenantsCard from './components/TenantsCard';
import LoadingCircle from '../../components/common/LoadingCircle';
import LoadingError from '../../components/common/LoadingError';
import CreateTenantModal from './Modal/CreateTenantModal';
import { updateTenant } from '../../services/Tenants/updateTenant';
import CreateAdminTenant from './Modal/CreateAdminTenant';
import { useOutletContext } from 'react-router-dom';
import Button from '../../components/common/Button';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function ShowAllTenants() {
  const { t } = useTranslation();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAdminOpen, setIsModalAdminOpen] = useState(false);
  const token = localStorage.getItem("Token");
  const { toggleSidebar, showSidebar } = useOutletContext();
  
  const refreshFlows = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getAllTenants(token);
      setTenants(data);
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
    return <LoadingCircle Phrase={t('tenantsManagement.loadingPhrase')} />;
  }

  if (error) {
    return <LoadingError Phrase={t('tenantsManagement.errorPhrase')} />;
  }

  async function openUpdate(tenant) {
    const newStatus = !tenant.active; 

    const data = await updateTenant(tenant.tenantId, token, newStatus);
    if (data.success) {
      refreshFlows();
    } else {
      console.log(data.message);
      alert(data.message);
    }
  }

  return (
    <>
      <CreateTenantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshFlows} 
      />
      <CreateAdminTenant
        isOpen={isModalAdminOpen}
        onClose={() => setIsModalAdminOpen(false)}
        onSuccess={refreshFlows} 
      />
        
      <div className="max-w-6xl p-4 sm:p-6 md:p-8 lg:p-12 mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          
          {/* Left Side: Professional Menu Icon & Title */}
          <div className='flex items-center gap-3 sm:gap-4 w-full md:w-auto'>
            <Button 
              onClick={toggleSidebar} 
              className="p-2 sm:p-2.5 bg-[#101B22] border border-slate-800 text-slate-300 hover:text-[#0D9EF2] hover:bg-slate-800/50 rounded-lg transition-all shrink-0 shadow-sm flex items-center justify-center"
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
            </Button>
            <div className='flex flex-col'>
              <h1 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold tracking-tight leading-tight">
                {t('tenantsManagement.title')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 sm:mt-1">
                {t('tenantsManagement.subtitle')}
              </p>
            </div> 
          </div>

          {/* Right Side: Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center'>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-customButton hover:brightness-110 text-slate-50 px-4 sm:px-6 py-2.5 sm:py-2 text-sm sm:text-base rounded-lg font-semibold transition-all shadow-lg flex justify-center items-center"
            >
              {t('tenantsManagement.addNewTenant')}
            </button>
            <button
              onClick={() => setIsModalAdminOpen(true)}
              className="w-full sm:w-auto bg-customButton hover:brightness-110 text-slate-50 px-4 sm:px-6 py-2.5 sm:py-2 text-sm sm:text-base rounded-lg font-semibold transition-all shadow-lg flex justify-center items-center"
            >
              {t('tenantsManagement.createAdminTenant')}
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {tenants.map((tenant) => (
            <TenantsCard 
              key={tenant.id}
              tenant={tenant} 
              openUpdate={openUpdate}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default ShowAllTenants;