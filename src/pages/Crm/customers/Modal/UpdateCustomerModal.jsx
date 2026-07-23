import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import Button from '../../../../components/common/Button';
import LoadingInButton from '../../../../components/common/LoadingInButton';
import { toast } from 'react-toastify';
import { getAgents } from '../../../../services/CRM/Customers/getaAents';
import { updateCustomer } from '../../../../services/CRM/Customers/updateCustomer';

const typeOptions = [
  { value: 'VIP', label: 'VIP' },
  { value: 'Corporate', label: 'Corporate' },
  { value: 'Individual', label: 'Individual' }
];

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Lead', label: 'Lead' }
];

const UpdateCustomerModal = ({ data, isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("Token");
  const [agents, setAgents] = useState([]);
  const [isAgentsLoading, setIsAgentsLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    type: 'Individual',
    status: 'Active',
    ownerAgentId: ''
  });

  useEffect(() => {
    if (isOpen && data) {
      setFormData({
        id: data.id || '',
        type: data.type || 'Individual',
        status: data.status || 'Active',
        ownerAgentId: data.ownerAgent?.id || ''
      });
    }
  }, [isOpen, data]);

  useEffect(() => {
    const fetchAgents = async () => {
      if (!isOpen) return;
      setIsAgentsLoading(true);
      try {
        const agentsData = await getAgents(token);
        if (Array.isArray(agentsData)) setAgents(agentsData);
      } catch (error) {
        toast.error("Failed to load agents.");
      } finally {
        setIsAgentsLoading(false);
      }
    };
    fetchAgents();
  }, [isOpen, token]);

  const agentOptions = agents.map(agent => ({
    value: agent.id,
    label: `${agent.firstName} ${agent.lastName}`
  }));

  const handleSelectChange = (selectedOption, fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: selectedOption ? selectedOption.value : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      type: formData.type,
      status: formData.status,
      ownerAgent: {
        id: formData.ownerAgentId ? parseInt(formData.ownerAgentId) : null
      }
    };

    try {
      const response = await updateCustomer(payload, token, formData.id);
      if (response && response.success) {
        toast.success(response.message || "Customer updated successfully!");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(response.message || "Error updating customer.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating customer.");
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
      <form onSubmit={handleSubmit} className="bg-[#171A21] rounded-xl border border-[#2A2E37] p-8 w-full max-w-lg flex flex-col gap-6">
        <div>
          <h2 className="text-2xl text-center font-bold text-white">Update Customer Settings</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Customer Type</label>
            <Select
              value={typeOptions.find(opt => opt.value === formData.type) || null}
              options={typeOptions}
              styles={customStyles}
              onChange={(opt) => handleSelectChange(opt, 'type')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Status</label>
            <Select
              value={statusOptions.find(opt => opt.value === formData.status) || null}
              options={statusOptions}
              styles={customStyles}
              onChange={(opt) => handleSelectChange(opt, 'status')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Owner Agent</label>
            <Select
              value={agentOptions.find(opt => opt.value === formData.ownerAgentId) || null}
              options={agentOptions}
              styles={customStyles}
              isLoading={isAgentsLoading}
              onChange={(opt) => handleSelectChange(opt, 'ownerAgentId')}
              isClearable
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-slate-800 pt-6">
          <Button type="button" onClick={onClose} className="text-slate-400 hover:text-white text-sm font-semibold">Cancel</Button>
          <Button type="submit" className="bg-[#0D9EF2] hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm" disabled={loading}>
            {loading ? <LoadingInButton /> : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const customStyles = {
  control: (base, state) => ({ ...base, backgroundColor: "#1E293B", borderColor: state.isFocused ? "#3B82F6" : "#334155", minHeight: "42px", borderRadius: "0.5rem" }),
  singleValue: (base) => ({ ...base, color: "#FFFFFF" }),
  menu: (base) => ({ ...base, backgroundColor: "#1E293B" }),
  option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? "#2563EB" : "#1E293B", color: "white", cursor: "pointer" }),
  placeholder: (base) => ({ ...base, color: "#64748B" })
};

export default UpdateCustomerModal;