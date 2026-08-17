import React, { useCallback, useState, useEffect } from 'react';
import { Megaphone, Info, Menu } from 'lucide-react'; // أيقونات معبرة
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import CampaignCard from './components/CampaignCard';
import { getAllCampaigns } from '../../../services/CRM/Campaigns/getAllCampaigns';
import { deleteCampaign } from '../../../services/CRM/Campaigns/deleteCampaign';
import { toast } from 'react-toastify';
import CreateCampaignModal from './Modal/CreateCampaignModel';
import UpdateCampaignModal from './Modal/UpdateCampaignModal';
import { useOutletContext } from 'react-router-dom';


function ShowAllCampaigns() {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const token = localStorage.getItem("Token");
  const [isModalCreateCampaignOpen, setIsModalCreateCampaignOpen] = useState(false);
  const [isModalUpdateCampaignOpen, setIsModalUpdateCampaignOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const context = useOutletContext() || {};
  const { toggleSidebar } = context;

  const handleOpenUpdateModal = (id) => {
    setSelectedCampaignId(id); // تخزين الـ id
    setIsModalUpdateCampaignOpen(true); // فتح المودال
  };

  const refreshCampaigns = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getAllCampaigns(token);
      setCampaigns(data);
      setError(false);
    } catch (err) {
      setError(true);
      console.error("Error fetching campaigns:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshCampaigns();
  }, [refreshCampaigns]);

  const handleDeleteCampaign = async (id) => {
    try {
      const response = await deleteCampaign(id, token);
      toast.success(response.message || t('showAllCampaigns.deleteSuccess'), {
        position: "top-left",
        autoClose: 3000,
        className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl text-white',
      });
      refreshCampaigns();
    } catch (err) {
      console.error(t('showAllCampaigns.deleteErrorTitle'), err);
      alert(t('showAllCampaigns.deleteErrorAlert'));
    }
  };

  if (loading) return <div>{t('showAllCampaigns.loading')}</div>;

  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-200 font-sans p-8 md:p-12" dir="ltr">
      <CreateCampaignModal
        isOpen={isModalCreateCampaignOpen} 
        onSuccess={() => refreshCampaigns()}
        onClose={() => setIsModalCreateCampaignOpen(false)}
      />
      <UpdateCampaignModal
        isOpen={isModalUpdateCampaignOpen} 
        onSuccess={() => refreshCampaigns()}
        onClose={() => setIsModalUpdateCampaignOpen(false)}
        campaignId={selectedCampaignId}
      />
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3">
            <Button 
              onClick={toggleSidebar} 
              className="p-2 text-slate-300 hover:text-sky-400  rounded-lg transition-all shrink-0"
              aria-label={t('showAllCampaigns.toggleSidebar')}
            >
              <Menu size={22} />
            </Button>
            
            <h1 className="text-2xl text-white font-bold tracking-wide">{t('showAllCampaigns.title')}</h1>
          </div>

          <div className="flex gap-4 items-center">
            <Button 
              onClick={() => setIsModalCreateCampaignOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 font-bold rounded-lg"
            >
              {t('showAllCampaigns.createCampaign')}
            </Button>
          </div>
        </div>

        {/* Educational Container */}
        <div className="bg-[#101B22] border border-gray-800 rounded-xl p-6 flex items-start gap-4">
          <div className="mt-1">
            <Info className="text-[#0D9EF2]" size={24} />
          </div>
          <div>
            <h3 className="text-white font-bold mb-1">{t('showAllCampaigns.infoTitle')}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('showAllCampaigns.infoDesc')}
            </p>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id} 
              campaign={campaign} 
              onDelete={() => handleDeleteCampaign(campaign.id)}
              onUpdate={() => handleOpenUpdateModal(campaign.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShowAllCampaigns;