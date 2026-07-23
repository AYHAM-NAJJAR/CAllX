import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import Button from '../../../../components/common/Button';
import LoadingInButton from '../../../../components/common/LoadingInButton';
import { toast } from 'react-toastify';
import { createCustomer } from '../../../../services/CRM/Customers/CreateCustomer';
import { getAgents } from '../../../../services/CRM/Customers/getaAents';
import { getAllCampaigns } from '../../../../services/CRM/Campaigns/getAllCampaigns';
import { CreateLead } from '../../../../services/CRM/Leads/CreateLead';

const CreateLeadModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("Token");
  
  const [agents, setAgents] = useState([]);
  const [isAgentsLoading, setIsAgentsLoading] = useState(false);
  
  const [campaigns, setCampaigns] = useState([]);
  const [isCampaignsLoading, setIsCampaignsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return;
      
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
        toast.error("Failed to load data.");
      } finally {
        setIsAgentsLoading(false);
        setIsCampaignsLoading(false);
      }
    };
    fetchData();
  }, [isOpen, token]);

  const agentOptions = agents.map(agent => ({
    value: agent.id,
    label: `${agent.firstName} ${agent.lastName}`
  }));

  const campaignOptions = campaigns.map(campaign => ({
    value: campaign.id,
    label: campaign.name
  }));

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    campaignId: null,
    assignedAgentId: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption, fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: selectedOption ? selectedOption.value : null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await CreateLead(formData, token);
      
      if (response.success || response) { 
         toast.success(response.message || "Customer created successfully!", {
                  position: "top-left",
                  autoClose: 3000,
                  className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
                });
        setFormData({
          name: '',
          phoneNumber: '',
          campaignId: null,
          assignedAgentId: null
        });

        if (onSuccess) onSuccess(); 
        onClose(); 
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating lead.");
    } finally {
      setLoading(false);
    }
  };  
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="outline-none"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm "
    >
      <form onSubmit={handleSubmit} className="bg-[#171A21] rounded-xl border border-[#2A2E37] p-10 w-full max-w-xl flex flex-col gap-6 shadow-3xl overflow-y-auto custom-scrollbar">
        
        <div>
          <h2 className="text-2xl text-center font-bold text-white tracking-wide">Create New Lead</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="+963..."
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              required
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
              className="text-sm"
              isClearable
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Assigned Agent</label>
            <Select
              value={agentOptions.find(opt => opt.value === formData.assignedAgentId) || null}
              options={agentOptions}
              styles={customStyles}
              isLoading={isAgentsLoading}
              onChange={(opt) => handleSelectChange(opt, 'assignedAgentId')}
              placeholder="Select Agent..."
              className="text-sm"
              isClearable
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-slate-800 pt-6">
          <Button type="button" onClick={onClose} className="text-slate-400 hover:text-white text-sm font-semibold transition-colors">
            Cancel
          </Button>
          <Button type="submit" className="bg-[#0D9EF2] hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-500/10 flex items-center justify-center min-w-[140px]" disabled={loading}>
            {loading ? <LoadingInButton /> : "Create Lead"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

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

export default CreateLeadModal;