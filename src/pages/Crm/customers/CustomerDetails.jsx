import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PhoneCall, Copy, Check, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Button from '../../../components/common/Button';
import UpdateCustomerModal from './Modal/UpdateCustomerModal';
import { GetCustomerProfile } from '../../../services/CRM/Customers/GetCustomerProfile';
import AssignTagModal from './Modal/AssignTagModal';
import { deleteCustomer } from '../../../services/CRM/Customers/deleteCustomer';
import { deleteCustomerTag } from '../../../services/CRM/Customers/deleteCustomerTag'; 
import { toast } from 'react-toastify';
import { getOneCustomer } from '../../../services/CRM/Customers/getOneCustomer';
import { updateCustomerNotes } from '../../../services/CRM/Customers/updateCustomerNotes';

const CustomerDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const useNavigateInstance = useNavigate(); // keeping variable name or alias

  // States
  const [customer, setCustomer] = useState(null);
  const [oneCustomer, setOneCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isOpenModalUpdateCustomer, setIsOpenModalUpdateCustomer] = useState(false);
  const [isOpenModalCreateTag, setIsOpenModalCreateTag] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState('');
  
  const token = localStorage.getItem('Token'); 
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const refreshCustomerDetails = useCallback(async () => {
    if (!token || !id) return;
    try {
      setLoading(true);
      setError(false);
      
      const data = await GetCustomerProfile(token, id);
      setCustomer(data); 
      setNotesValue(data.notes || '');
    } catch (err) {
      setError(true);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    refreshCustomerDetails();
  }, [refreshCustomerDetails]);

  const refreshCustomerById = useCallback(async () => {
    if (!token || !id) return;
    try {
      setLoading(true);
      setError(false);
      
      const data = await getOneCustomer(token, id);
      setOneCustomer(data); 
    } catch (err) {
      setError(true);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    refreshCustomerById();
  }, [refreshCustomerById]);

  useEffect(() => {
    if (customer) {
      setNotesValue(customer.notes || '');
    }
  }, [customer]);

  const handleDeleteCustomer = async () => {
    const confirmDelete = window.confirm(t('customerDetails.deleteConfirm'));
    if (!confirmDelete) return;

    try {
      setLoading(true); 
      const response = await deleteCustomer(id, token);

      if (response && (response.success || response.status === 200 || response.status === 204)) {
        toast.success(response.message || t('customerDetails.deleteSuccess'), {
          position: "top-left",
          autoClose: 3000,
          className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl text-white',
        });
        
        useNavigateInstance("/main/customers");
      } else {
        toast.error(response?.message || "Failed to delete customer");
      }
    } catch (err) {
      console.error("Failed to delete customer:", err);
      toast.error(err.response?.data?.message || "Error connecting to server while deleting");
    } finally {
      setLoading(false); 
    }
  };

  const handleDeleteTag = async (tagId, tagName) => {
    const confirmTagDelete = window.confirm(t('customerDetails.tagDeleteConfirm', { name: tagName }));
    if (!confirmTagDelete) return;

    try {
      await deleteCustomerTag(id, tagId, token);

      toast.success(t('customerDetails.tagDeleteSuccess', { name: tagName }), {
        position: "top-left",
        autoClose: 2000,
        className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl text-white',
      });

      refreshCustomerDetails(); 
    } catch (err) {
      console.error("Failed to delete tag:", err);
      toast.error(err.response?.data?.message || "Error occurred while deleting the tag");
    }
  };

  const handleSaveNotes = async () => {
    try {
      setIsSavingNotes(true);
      await updateCustomerNotes(id, notesValue, token);
      toast.success(t('customerDetails.notesSuccess'));
      setIsEditingNotes(false);
      refreshCustomerDetails();
    } catch (err) {
      console.error(err);
      toast.error(t('customerDetails.notesError'));
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleCopyPhone = (phone) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    toast.info(t('customerDetails.phoneCopied'), { autoClose: 1500, position: 'top-center' });
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center text-white">
        <p className="text-xl font-semibold animate-pulse">{t('customerDetails.loading')}</p>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center text-white gap-4">
        <p className="text-xl text-red-400">{t('customerDetails.errorTitle')}</p>
        <Button onClick={() => useNavigateInstance("/main/customers")} className="bg-gray-800 px-6 py-2 rounded-full text-sm">
          {t('customerDetails.backToList')}
        </Button>
      </div>
    );
  }

  const primaryContact = customer.contacts?.find(c => c.isPrimary) || customer.contacts?.[0];
  const phoneNumber = oneCustomer?.phoneNumber || customer.phoneNumber || primaryContact?.phoneNumber;

  return (
    <div className="min-h-screen bg-primary text-gray-200 font-sans">
      
      {/* Modals */}
      <UpdateCustomerModal
        data={oneCustomer} 
        isOpen={isOpenModalUpdateCustomer} 
        onClose={() => setIsOpenModalUpdateCustomer(false)}
        onSuccess={refreshCustomerDetails} 
      />
      <AssignTagModal
        isOpen={isOpenModalCreateTag} 
        onClose={() => setIsOpenModalCreateTag(false)}
        customerId={id}
        onSuccess={refreshCustomerDetails}
      />

      <div className="container mx-auto px-10 py-12">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-wider text-white">{t('customerDetails.headerTitle')}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsOpenModalCreateTag(true)}
              className="bg-sky-800 rounded-full ease-in transition-colors px-6 py-2.5 text-sm font-semibold hover:bg-sky-600 text-white"
            >
              {t('customerDetails.addTag')}
            </Button>
            <Button
              onClick={() => setIsOpenModalUpdateCustomer(true)}
              className="rounded-full bg-customButton hover:bg-sky-400 ease-in transition-colors px-6 py-2.5 text-sm font-bold text-white"
            >
              {t('customerDetails.editCustomer')}
            </Button>
            <Button
              onClick={handleDeleteCustomer}
              className="rounded-full text-white bg-red-500 hover:bg-red-600 ease-in transition-colors px-6 py-2.5 text-sm font-bold"
            >
              {t('customerDetails.deleteCustomer')}
            </Button>
          </div>
        </header>

        {/* Customer Header Info & Badges */}
        <section className="mb-10">
          <div className="flex flex-wrap gap-2.5 mb-5">
            <span className="bg-[#153444] text-[#81D4FA] text-[10px] font-bold px-3 py-0.5 rounded uppercase tracking-wider">
              {customer.type}
            </span>
            <span className="bg-[#1E3A2E] text-[#66BB6A] text-[10px] font-bold px-3 py-0.5 rounded uppercase tracking-wider">
              {customer.status}
            </span>
            
            {customer.tags && customer.tags.map((tag, idx) => (
              <Button 
                onClick={() => handleDeleteTag(tag.id || tag, tag.name || tag)}
                key={idx} 
                className="bg-gray-800 hover:bg-red-950/40 hover:text-red-400 group flex items-center gap-1.5 transition-all text-gray-300 text-[10px] font-bold px-3 py-0.5 rounded uppercase tracking-wider"
                title="Click to remove tag"
              >
                <span>{tag.name || tag}</span>
                <span className="text-gray-500 group-hover:text-red-400 font-normal ml-0.5">×</span>
              </Button>
            ))}
          </div>
          
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div>
              <div className="flex items-center justify-start gap-4">
                <span className="text-gray-500 text-lg font-mono block mb-1">
                  {t('customerDetails.customerId', { id: customer.id })}
                </span>
                <p className="bg-slate-600 text-white px-3 py-1 rounded-full text-sm font-semibold shrink-0">
                  {customer.ownerAgentName ? t('customerDetails.assignedAgent', { name: customer.ownerAgentName }) : t('customerDetails.noAgent')}
                </p>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight leading-tight mt-1">
                {customer.name}
              </h2>
              {customer.originatingCampaignName && (
                <p className="text-gray-500 mt-2 text-sm">
                  {t('customerDetails.campaign')} <span className="text-gray-300 font-medium">{customer.originatingCampaignName}</span>
                </p>
              )}
            </div>
            
            {/* Quick Contact Bar */}
            <div className="bg-[#111821] border border-[#0D9EF2]/40 p-4 rounded-2xl flex flex-wrap sm:flex-nowrap items-center gap-4 hover:border-green-500 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#0D9EF2]/10 border border-[#0D9EF2]/30 flex items-center justify-center text-[#0D9EF2] shrink-0">
                <PhoneCall size={24} className="animate-pulse" />
              </div>
              
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-0.5">
                  {t('customerDetails.directLine')}
                </span>
                <p className="text-xl font-mono font-bold text-white tracking-wider">
                  {phoneNumber || t('customerDetails.noPhone')}
                </p>
              </div>

              {phoneNumber && (
                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <button
                    onClick={() => handleCopyPhone(phoneNumber)}
                    title={t('customerDetails.copyPhoneTooltip')}
                    className="p-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all border border-gray-700 active:scale-95 flex items-center justify-center"
                  >
                    {copiedPhone ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                  </button>
                  <a
                    href={`tel:${phoneNumber}`}
                    className="flex-1 sm:flex-none justify-center bg-green-500 hover:bg-green-600 text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95"
                  >
                    <PhoneCall size={16} />
                    <span>{t('customerDetails.callNow')}</span>
                  </a>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* Primary Contact Section */}
        <section className="bg-[#111821] border border-gray-800 w-fit rounded-3xl p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-10">
          <div className="space-y-6 flex-1">
            <div>
              <p className="text-[#00A3FF] text-xs font-bold tracking-widest uppercase mb-1.5">
                {t('customerDetails.primaryContact')}
              </p>
              <h3 className="text-3xl font-extrabold text-white">
                {primaryContact ? `${primaryContact.firstName} ${primaryContact.lastName}` : 'N/A'}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-gray-300 text-sm">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-500 shrink-0" />
                <span>{primaryContact?.email || t('customerDetails.noEmail')}</span>
              </div>
              <div className="flex items-center gap-3">
                <PhoneCall size={18} className="text-gray-500 shrink-0" />
                <span className="font-mono">{phoneNumber || t('customerDetails.noPhone')}</span>
              </div>
              {customer.totalOpportunityValue !== undefined && (
                <div className="flex items-center gap-3 md:col-span-2">
                  <span className="text-lg text-gray-500">💰</span>
                  <span>{t('customerDetails.totalOpportunity')} <strong className="text-emerald-400">${customer.totalOpportunityValue.toLocaleString()}</strong></span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main Grid Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <section className="lg:col-span-2 space-y-10">
            {/* Notes Section */}
            <div className="bg-[#111821] border border-gray-800 rounded-3xl p-10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-800/60">
                <h4 className="text-lg font-bold text-white uppercase tracking-wider">{t('customerDetails.customerNotes')}</h4>
                <Button
                  onClick={() => isEditingNotes ? handleSaveNotes() : setIsEditingNotes(true)}
                  disabled={isSavingNotes}
                  className={`${isEditingNotes ? 'bg-emerald-600' : 'bg-customButton'} hover:opacity-80 transition-all text-gray-300 text-[10px] font-bold px-4 py-1.5 rounded uppercase tracking-wider`}
                >
                  {isSavingNotes ? t('customerDetails.saving') : isEditingNotes ? t('customerDetails.save') : t('customerDetails.edit')}
                </Button>
              </div>
              
              {isEditingNotes ? (
                <textarea
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  className="w-full bg-[#151D29] text-gray-200 p-4 rounded-xl border border-gray-600 focus:outline-none focus:border-sky-500"
                  rows={5}
                  autoFocus 
                />
              ) : (
                <div className="text-gray-200 text-base leading-relaxed bg-[#151D29]/40 p-6 rounded-2xl border border-gray-800/50 whitespace-pre-line min-h-[120px]">
                  {customer.notes || <span className="text-gray-500 italic">{t('customerDetails.noNotes')}</span>}
                </div>
              )}
            </div>

            {/* Interactions History */}
            <div className="bg-[#111821] border border-gray-800 rounded-3xl p-10 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-800/60">
                <h4 className="text-lg font-bold text-white uppercase tracking-wider">{t('customerDetails.interactionsHistory')}</h4>
              </div>
              {customer.interactions && customer.interactions.length > 0 ? (
                <div className="space-y-4">
                  {customer.interactions.map((interaction) => (
                    <div key={interaction.id} className="bg-[#151D29]/60 border border-gray-800 p-5 rounded-2xl flex justify-between items-center">
                      <div>
                        <span className="bg-blue-500/20 text-blue-400 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mr-3">
                          {interaction.type}
                        </span>
                        <span className="text-gray-400 text-xs">{t('customerDetails.ref', { ref: interaction.externalRefId })}</span>
                        <p className="text-gray-300 mt-2 text-sm">
                          {t('customerDetails.conductedBy')} <span className="text-white font-medium">{interaction.agentName}</span>
                        </p>
                      </div>
                      <span className="text-gray-500 text-xs font-mono">
                        {new Date(interaction.occurredAt).toLocaleString('en-US')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">{t('customerDetails.noInteractions')}</p>
              )}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-10">
            <div className="bg-[#111821] border border-gray-800 rounded-3xl p-10">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">{t('customerDetails.activeOpportunities')}</h4>
              {customer.opportunities && customer.opportunities.length > 0 ? (
                <div className="space-y-5">
                  {customer.opportunities.map((opp) => (
                    <div key={opp.id} className="pb-5 border-b border-gray-800/60 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full">
                          {opp.stageName}
                        </span>
                        <span className="text-white font-bold text-lg">
                          ${opp.value.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{t('customerDetails.expectedClose')}</span>
                        <span>{new Date(opp.expectedCloseDate).toLocaleDateString('en-US')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic text-sm">{t('customerDetails.noOpportunities')}</p>
              )}
            </div>

            {customer.originatingCampaignName && (
              <div className="bg-[#111821] border border-gray-800 rounded-3xl p-8 border-l-4 border-l-[#1E88E5]">
                <div className="flex gap-3">
                  <span className="text-2xl text-[#1E88E5]">🎯</span>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">{t('customerDetails.originatingCampaign')}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {customer.originatingCampaignName}
                    </p>
                    {customer.originatingLeadId && (
                      <span className="text-[11px] text-gray-500 font-mono block">{t('customerDetails.leadId', { id: customer.originatingLeadId })}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;