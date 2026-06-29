import { useEffect, useState, useCallback } from 'react';





import { getAllTenants } from '../../services/Tenants/getAllTenants';
import TenantsCard from './components/TenantsCard';
import LoadingCircle from '../../components/common/LoadingCircle';
import LoadingError from '../../components/common/LoadingError';
import CreateTenantModal from './Modal/CreateTenantModal';
import { updateTenant } from '../../services/Tenants/updateTenant';


function ShowAllTenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("Token");


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
    return <LoadingCircle Phrase={"Tenants"} />;
  }

  if (error) {
    return <LoadingError Phrase={"Tenants"} />;
  }
     async function openUpdate(tenant) {
        
        const data = await updateTenant(tenant.tenantId,token);
        if (data.success) {
          alert(data.message)
        }
      }

  return (
    <>
      
        <CreateTenantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshFlows} 
      />
        
        
      <div className="max-w-6xl p-20 mx-auto">
        <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl text-white font-bold">Company Tenants</h1>
            <p className="text-slate-400">Manage your organization's tenants and their status from here.</p>
        </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-customButton text-slate-50 px-6 py-2 rounded-lg font-semibold transition"
          >
            Add New Tenant
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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