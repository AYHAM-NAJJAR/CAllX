import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import Button from '../../../../components/common/Button';
import LoadingInButton from '../../../../components/common/LoadingInButton';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

// الخدمات
import { getAgents } from '../../../../services/CRM/Customers/getaAents';
import { getOneLead } from '../../../../services/CRM/Leads/getOneLead';
import { deleteLead } from '../../../../services/CRM/Leads/deleteLead';
import { updateLead } from '../../../../services/CRM/Leads/updateLead';
import { getAllCampaigns } from '../../../../services/CRM/Campaigns/getAllCampaigns'; 
import { convertLead } from '../../../../services/CRM/Leads/convertLead';

const statusOptions = [
  { value: 'NEW', label: 'NEW' },
  { value: 'CONTACTED', label: 'CONTACTED' },
  { value: 'QUALIFIED', label: 'QUALIFIED' },
  { value: 'CONVERTED', label: 'CONVERTED' }
];

const customerTypeOptions = [
  { value: 'REGULAR', label: 'REGULAR' },
  { value: 'VIP', label: 'VIP' }
];

const UpdateLeadModal = ({ isOpen, onClose, onSuccess, leadId }) => {
  const token = localStorage.getItem("Token");
  
  // حالات التحميل
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  
  // حالة التحكم بوضع التحويل
  const [isConvertingMode, setIsConvertingMode] = useState(false);
  
  const [agents, setAgents] = useState([]);
  const [isAgentsLoading, setIsAgentsLoading] = useState(false);
  
  const [campaigns, setCampaigns] = useState([]);
  const [isCampaignsLoading, setIsCampaignsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    status: 'NEW',
    campaignId: null,
    assignedAgentId: null
  });

  // بيانات التحويل (الـ Body)
  const [convertData, setConvertData] = useState({
    customerType: 'VIP',
    password: 'ChantalPassword2026' // القيمة الافتراضية كما طلبت
  });

  useEffect(() => {
    const fetchDropdownData = async () => {
      if (!isOpen || !token) return;
      setIsAgentsLoading(true);
      setIsCampaignsLoading(true);
      try {
        const [agentsData, campaignsData] = await Promise.all([
          getAgents(token),
          getAllCampaigns(token)
        ]);
        
        if (Array.isArray(agentsData)) setAgents(agentsData);
        if (Array.isArray(campaignsData)) setCampaigns(campaignsData);
      } catch (error) {
        toast.error("Failed to load agents or campaigns.");
      } finally {
        setIsAgentsLoading(false);
        setIsCampaignsLoading(false);
      }
    };
    fetchDropdownData();
  }, [isOpen, token]);

  const agentOptions = agents.map(agent => ({
    value: agent.id,
    label: `${agent.firstName} ${agent.lastName}`
  }));

  const campaignOptions = campaigns.map(campaign => ({
    value: campaign.id,
    label: campaign.name
  }));

  const fetchLeadData = useCallback(async () => {
    if (!token || !leadId || !isOpen) return;
    try {
      setIsFetching(true);
      // إعادة تعيين وضع التحويل عند فتح نافذة جديدة
      setIsConvertingMode(false);
      
      const data = await getOneLead(token, leadId);
      const leadData = data?.data || data; 
      
      setFormData({
        name: leadData.name || '',
        status: leadData.status || 'NEW',
        campaignId: leadData.campaignId || null,
        assignedAgentId: leadData.assignedAgentId || null
      });
    } catch (err) {
      toast.error("Failed to load lead data.");
    } finally {
      setIsFetching(false);
    }
  }, [token, leadId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchLeadData();
    }
  }, [fetchLeadData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConvertInputChange = (e) => {
    const { name, value } = e.target;
    setConvertData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption, fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: selectedOption ? selectedOption.value : null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await updateLead(leadId, formData, token);
      
      toast.success("Lead updated successfully!", {
        position: "top-left",
        autoClose: 3000,
        className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
      });
      
      if (onSuccess) onSuccess(); 
      onClose(); 
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error updating lead.");
    } finally {
      setIsUpdating(false);
    }
  };  

  const handleDelete = async () => {
    if (!leadId) {
      toast.error("Lead ID is missing.");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteLead(leadId, token); 
      toast.success("Lead deleted successfully!", {
        position: "top-left",
        autoClose: 3000,
        className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl',
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the lead.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConvert = async () => {
    // 1. إذا لم نكن في وضع التحويل، نقوم بتفعيله ونوقف التنفيذ
    if (!isConvertingMode) {
      setIsConvertingMode(true);
      return;
    }

    // 2. إذا كنا في وضع التحويل وتم النقر للتأكيد، نرسل الطلب
    if (!leadId) {
      toast.error("Lead ID is missing.");
      return;
    }

    setIsConverting(true);
    try {
      // تمرير بيانات التحويل (convertData) في الـ API
      await convertLead(leadId, convertData, token);
      toast.success("Lead converted to customer successfully!", {
        position: "top-left",
        autoClose: 3000,
        className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl',
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to convert lead.");
    } finally {
      setIsConverting(false);
    }
  };

  // متغير عام لتعطيل الأزرار أثناء أي عملية تحميل
  const isAnyActionLoading = isUpdating || isDeleting || isConverting || isFetching;
  
  // تعطيل الحقول الأساسية إذا كنا في وضع التحويل أو أثناء التحميل
  const areMainFieldsDisabled = isAnyActionLoading || isConvertingMode;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="outline-none"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
    >
      <form onSubmit={handleSubmit} className="bg-[#171A21] rounded-xl border border-[#2A2E37] p-10 w-full max-w-2xl flex flex-col gap-6 shadow-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        <div className='flex items-center flex-row justify-between'>
         <div className='flex flex-col items-start'>
          <h2 className="text-2xl text-center font-bold text-white tracking-wide">
            {isConvertingMode ? "Convert Lead to Customer" : "Update Lead"}
          </h2>
          <p className="text-center text-xs text-gray-400 mt-1">
            {isConvertingMode ? "Please provide the customer type and password to complete conversion." : "Modify the lead information below."}
          </p>
         </div>
         <Button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-white text-sm font-semibold transition-colors"
          >
            <X/>
          </Button>
        </div>

        {isFetching ? (
          <div className="flex justify-center items-center py-10">
             <span className="text-white">Loading lead data...</span>
          </div>
        ) : (
          <div className="space-y-4 relative">
            
            {/* طبقة شفافة فوق الحقول القديمة إذا كنا في وضع التحويل لإعطاء إيحاء بصري بالتعطيل */}
            {isConvertingMode && (
              <div className="absolute inset-0 bg-[#171A21]/50 z-10 rounded-lg pointer-events-none transition-all duration-300"></div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Lead Name</label>
                <input
                  type="text"
                  placeholder="ex: John Doe"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={areMainFieldsDisabled}
                  className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Status</label>
                <Select
                  value={statusOptions.find(opt => opt.value === formData.status) || null}
                  options={statusOptions}
                  styles={customStyles}
                  onChange={(opt) => handleSelectChange(opt, 'status')}
                  placeholder="Select Status..."
                  isDisabled={areMainFieldsDisabled}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Campaign</label>
                <Select
                  value={campaignOptions.find(opt => opt.value === formData.campaignId) || null}
                  options={campaignOptions}
                  styles={customStyles}
                  isLoading={isCampaignsLoading}
                  onChange={(opt) => handleSelectChange(opt, 'campaignId')}
                  placeholder="Select Campaign..."
                  isDisabled={areMainFieldsDisabled}
                  className="text-sm"
                  isClearable
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Assigned Agent</label>
                <Select
                  value={agentOptions.find(opt => opt.value === formData.assignedAgentId) || null}
                  options={agentOptions}
                  styles={customStyles}
                  isLoading={isAgentsLoading}
                  onChange={(opt) => handleSelectChange(opt, 'assignedAgentId')}
                  placeholder="Select Agent..."
                  isDisabled={areMainFieldsDisabled}
                  className="text-sm"
                  isClearable 
                />
              </div>
            </div>
            
          </div>
        )}

        {/* حقول التحويل التي تنسدل عند تفعيل وضع التحويل */}
        {isConvertingMode && (
          <div className="mt-4 p-5 bg-[#1E293B] border border-emerald-500/30 rounded-xl shadow-inner transition-all duration-500 ease-in-out">
            <h3 className="text-emerald-400 font-bold mb-4 border-b border-emerald-500/20 pb-2">Conversion Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Customer Type</label>
                <Select
                  value={customerTypeOptions.find(opt => opt.value === convertData.customerType) || null}
                  options={customerTypeOptions}
                  styles={customStyles}
                  onChange={(opt) => setConvertData(prev => ({ ...prev, customerType: opt ? opt.value : 'REGULAR' }))}
                  placeholder="Select Type..."
                  isDisabled={isConverting}
                  className="text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Password</label>
                <input
                  type="text"
                  name="password"
                  value={convertData.password}
                  onChange={handleConvertInputChange}
                  disabled={isConverting}
                  className="w-full text-white bg-[#0f172a] border border-slate-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm disabled:opacity-50"
                  required={isConvertingMode}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-slate-800 p-6 mt-4">
          {/* زر التراجع في حالة الدخول لوضع التحويل */}
          {isConvertingMode && (
            <Button 
              type="button" 
              onClick={() => setIsConvertingMode(false)} 
              className="bg-transparent hover:bg-slate-800 text-slate-300 border border-slate-600 px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center min-w-[100px]"
              disabled={isAnyActionLoading}
            >
              Cancel
            </Button>
          )}

          {/* إخفاء أزرار الحذف والتعديل إذا كنا في وضع التحويل */}
          {!isConvertingMode && (
            <>
              <Button 
                type="button" 
                onClick={handleDelete} 
                className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-red-500/10 flex items-center justify-center min-w-[100px]"
                disabled={isAnyActionLoading}
              >
                {isDeleting ? <LoadingInButton /> : "Delete"}
              </Button>

              <Button 
                type="submit" 
                className="bg-[#0D9EF2] hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-500/10 flex items-center justify-center min-w-[100px]"
                disabled={isAnyActionLoading}
              >
                {isUpdating ? <LoadingInButton /> : "Update"}
              </Button>
            </>
          )}

          <Button 
            type="button" 
            onClick={handleConvert}
            className={`${isConvertingMode ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' : 'bg-slate-700 hover:bg-emerald-600 shadow-slate-700/10'} text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg flex items-center justify-center min-w-[160px] transition-all duration-300`}
            disabled={isAnyActionLoading}
          >
            {isConverting ? <LoadingInButton /> : (isConvertingMode ? "Confirm Conversion" : "Convert To Customer")}
          </Button>
        </div>

      </form>
    </Modal>
  );
};

// ... customStyles تبقى كما هي ...
const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#1E293B",
    borderColor: state.isFocused ? "#3B82F6" : "#334155",
    boxShadow: "none",
    minHeight: "42px",
    borderRadius: "0.5rem",
    "&:hover": {
      borderColor: "#475569"
    }
  }),
  singleValue: (base) => ({
    ...base,
    color: "#FFFFFF",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#1E293B",
    border: "1px solid #334155",
    zIndex: 9999
  }),
  menuList: (base) => ({
    ...base,
    padding: "4px",
    maxHeight: "200px",
    "::-webkit-scrollbar": {
      width: "0px",
      background: "transparent"
    },
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#2563EB"
      : state.isFocused
      ? "#374151"
      : "#1E293B",
    color: "white",
    cursor: "pointer",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#64748B",
    fontSize: "14px"
  }),
  input: (base) => ({
    ...base,
    color: "#FFFFFF"
  })
};

export default UpdateLeadModal;