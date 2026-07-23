import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import Button from '../../../../components/common/Button';
import LoadingInButton from '../../../../components/common/LoadingInButton';
import { toast } from 'react-toastify';
import { getOneCampaign } from '../../../../services/CRM/Campaigns/getOneCampaign';
import { updateCampaign } from '../../../../services/CRM/Campaigns/updateCampaign';

const typeOptions = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'SOCIAL_MEDIA', label: 'Social Media' },
  { value: 'COLD_CALL', label: 'Cold Call' }
];

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PLANNED', label: 'Planned' }
];

const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "#1E293B",
    borderColor: "#334155",
    boxShadow: "none",
    minHeight: "42px",
    borderRadius: "0.5rem",
    color: "white"
  }),
  singleValue: (base) => ({ ...base, color: "#FFFFFF" }),
  menu: (base) => ({ ...base, backgroundColor: "#1E293B" }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#374151" : "#1E293B",
    color: "white"
  })
};

const UpdateCampaignModal = ({ isOpen, onClose, onSuccess, campaignId }) => {
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const token = localStorage.getItem("Token");

  const [formData, setFormData] = useState({
    name: '',
    type: 'EMAIL',
    status: 'PLANNED',
    startDate: '',
    endDate: ''
  });

  const refreshCampaignById = useCallback(async () => {
    if (!token || !campaignId || !isOpen) return;
    try {
      setIsFetching(true);
      const data = await getOneCampaign(token, campaignId);
      setFormData({
        name: data.name || '',
        type: data.type || 'EMAIL',
        status: data.status || 'PLANNED',
        // تأكد من تنسيق التاريخ ليكون YYYY-MM-DD
        startDate: data.startDate ? data.startDate.split('T')[0] : '',
        endDate: data.endDate ? data.endDate.split('T')[0] : ''
      });
    } catch (err) {
      toast.error("Failed to load campaign data.");
    } finally {
      setIsFetching(false);
    }
  }, [token, campaignId, isOpen]);

  useEffect(() => {
    refreshCampaignById();
  }, [refreshCampaignById]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await updateCampaign(formData, token, campaignId);
      if (response) {
                toast.success(response.message, {
                  position: "top-left",
                  autoClose: 3000,
                  className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
                });
        
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error("Error updating campaign.");
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
      <form onSubmit={handleSubmit} className="bg-[#171A21] rounded-xl border border-[#2A2E37] p-8 w-full max-w-lg shadow-3xl">
        <h2 className="text-2xl text-center font-bold text-white mb-6">Update Campaign</h2>
        
        {isFetching ? (
          <div className="flex justify-center p-10"><LoadingInButton /></div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Campaign Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} 
                className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 outline-none" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Type</label>
                <Select value={typeOptions.find(o => o.value === formData.type)} options={typeOptions} styles={customStyles}
                  onChange={(opt) => setFormData(prev => ({ ...prev, type: opt.value }))} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Status</label>
                <Select value={statusOptions.find(o => o.value === formData.status)} options={statusOptions} styles={customStyles}
                  onChange={(opt) => setFormData(prev => ({ ...prev, status: opt.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Start Date</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} 
                  className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">End Date</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} 
                  className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 outline-none" />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-800">
          <Button type="button" onClick={onClose} className="text-slate-400 hover:text-white">Cancel</Button>
          <Button type="submit" className="bg-[#0D9EF2] text-white px-6 py-2 rounded-lg" disabled={loading}>
            {loading ? <LoadingInButton /> : "Update Campaign"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateCampaignModal;