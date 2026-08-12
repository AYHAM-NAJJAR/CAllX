import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import axios from 'axios';

import Button from '../../../components/common/Button';
import LoadingInButton from '../../../components/common/LoadingInButton';
import { toast } from 'react-toastify';
import { BASE_URL, SECONDARY_URL } from '../../../services/Api/endpoints';
import { assignAgent } from '../../../services/Queue/assignAgentToQueue';



const AssignAgentToQueueModal = ({ isOpen, onClose, onSuccess, queueKey }) => {
  const [loading, setLoading] = useState(false);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [agentOptions, setAgentOptions] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  
  const token = localStorage.getItem("Token");

  // جلب قائمة الوكلاء (Agents) عند فتح المودل
  useEffect(() => {
    if (isOpen) {
      fetchAgents();
    }
  }, [isOpen]);

  const fetchAgents = async () => {
    setAgentsLoading(true);
    try {
      // استبدل الرابط التالي بـ endpoint الخاص بك بالطريقة المعتمدة لديك
      const response = await axios.get(`${BASE_URL}/admin/users/filter?type=AGENT`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.data && response.data.success) {
        // تحويل البيانات لتناسب مكتبة react-select (نعرض الاسم والبريد ونخزن الإيميل كقيمة)
        const options = response.data.data.map((user) => ({
          value: user.email, // القيمة المطلوبة للإرسال
          label: `${user.firstName} ${user.lastName} (${user.email})`, // الشكل المعروض في القائمة
        }));
        setAgentOptions(options);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to load agents");
    } finally {
      setAgentsLoading(false);
    }
  };

  // معالجة عملية الإرسال (Submit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAgent) {
      toast.error("Please select an agent");
      return;
    }

    setLoading(true);
    try {
      
      await assignAgent(queueKey, { agentIdentity: selectedAgent.value }, token);
      
      toast.success("Agent assigned successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to assign agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="outline-none"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 bg-black/50"
    >
      <form 
        onSubmit={handleSubmit}
        className="bg-[#171A21] rounded-xl border border-[#2A2E37] p-8 w-full max-w-lg flex flex-col gap-6 shadow-3xl"
      >
        <h2 className="text-2xl text-center font-semibold text-white">Assign Agent to Queue</h2>
        
        <div className="space-y-4">
          {/* حقل اختيار الوكيل */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Select Agent</label>
            <Select
              value={selectedAgent}
              options={agentOptions}
              styles={customStyles}
              onChange={(option) => setSelectedAgent(option)}
              placeholder={agentsLoading ? "Loading agents..." : "Select Agent by Email..."}
              isLoading={agentsLoading}
              className="text-sm"
              isClearable
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-slate-800 pt-6">
          <Button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-all"
            disabled={loading}
          >
            {loading ? <LoadingInButton /> : "Assign Agent"}
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
    ":-webkit-scrollbar": {
      width: "4px",
      background: "transparent"
    },
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

export default AssignAgentToQueueModal;