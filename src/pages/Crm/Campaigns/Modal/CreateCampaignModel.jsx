import React, { useState } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import Button from '../../../../components/common/Button';
import LoadingInButton from '../../../../components/common/LoadingInButton';
import { toast } from 'react-toastify';
import { createCampaign } from '../../../../services/CRM/Campaigns/createCampaign';

// خيارات الـ Type المحدثة
const typeOptions = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'SOCIAL_MEDIA', label: 'Social Media' },
  { value: 'COLD_CALL', label: 'Cold Call' }
];

// خيارات الـ Status المحدثة
const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PLANNED', label: 'Planned' }
];

const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#1E293B",
    borderColor: state.isFocused ? "#3B82F6" : "#334155",
    boxShadow: "none",
    minHeight: "42px",
    borderRadius: "0.5rem",
    "&:hover": { borderColor: "#475569" }
  }),
  singleValue: (base) => ({ ...base, color: "#FFFFFF" }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#1E293B",
    border: "1px solid #334155",
    zIndex: 9999
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#2563EB" : state.isFocused ? "#374151" : "#1E293B",
    color: "white",
    cursor: "pointer",
  }),
  placeholder: (base) => ({ ...base, color: "#64748B", fontSize: "14px" }),
  input: (base) => ({ ...base, color: "#FFFFFF" })
};

const CreateCampaignModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("Token");

  const [formData, setFormData] = useState({
    name: '',
    type: 'EMAIL',
    status: 'PLANNED',
    startDate: '',
    endDate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption, fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: selectedOption ? selectedOption.value : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // قم باستدعاء خدمة إنشاء الحملة هنا
      await createCampaign(formData, token); 
      console.log(formData);
      toast.success("Campaign created successfully!", { position: "top-left" });
      setFormData({ name: '', type: 'EMAIL', status: 'PLANNED', startDate: '', endDate: '' });
      if (onSuccess) onSuccess(); 
      onClose();
    } catch (error) {
        console.log(error);
      toast.error("Error creating campaign.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="outline-none"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
    >
      <form onSubmit={handleSubmit} className="bg-[#171A21] rounded-xl border border-[#2A2E37] p-8 w-full max-w-lg flex flex-col gap-6 shadow-3xl">
        
        <div>
          <h2 className="text-2xl text-center font-bold text-white tracking-wide">Create New Campaign</h2>
          <p className="text-center text-xs text-gray-400 mt-1">Fill in the details to launch your new outreach initiative.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Campaign Name</label>
            <input
              type="text"
              placeholder="ex: Q3 Renewal Push"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Type</label>
              <Select
                value={typeOptions.find(opt => opt.value === formData.type)}
                options={typeOptions}
                styles={customStyles}
                onChange={(opt) => handleSelectChange(opt, 'type')}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Status</label>
              <Select
                value={statusOptions.find(opt => opt.value === formData.status)}
                options={statusOptions}
                styles={customStyles}
                onChange={(opt) => handleSelectChange(opt, 'status')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-slate-800 pt-6">
          <Button type="button" onClick={onClose} className="text-slate-400 hover:text-white text-sm font-semibold">Cancel</Button>
          <Button type="submit" className="bg-[#0D9EF2] hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm" disabled={loading}>
            {loading ? <LoadingInButton /> : "Create Campaign"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateCampaignModal;