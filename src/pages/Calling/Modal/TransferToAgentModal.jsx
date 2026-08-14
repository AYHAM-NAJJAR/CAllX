import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { toast } from 'react-toastify';
import Select from 'react-select';
import axios from 'axios';

import LoadingInButton from '../../../components/common/LoadingInButton';
import { BASE_URL } from '../../../services/Api/endpoints';
import { transferCallToAgent } from '../../../services/call/core/transferCallToAgent';

const TransferToAgentModal = ({ isOpen, onClose, onSuccess, callId }) => {
  const [loading, setLoading] = useState(false);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [agentOptions, setAgentOptions] = useState([]);
  
  const token = localStorage.getItem("Token");
  const nodeRef = useRef(null);

  const [formData, setFormData] = useState({
    targetAgentIdentity: '',
  });

  const [selectedAgent, setSelectedAgent] = useState(null);

  // جلب الوكلاء باستخدام الـ API الجديد
  const fetchAgents = async () => {
    setAgentsLoading(true);
    try {
      // استبدل BASE_URL بالمتغير الخاص برابط الخادم لديك إذا لزم الأمر
      const response = await axios.get(`${BASE_URL}/admin/users/filter?type=AGENT`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.data && response.data.success) {
        const options = response.data.data.map((user) => ({
          value: user.email, // أو user.identity حسب ما يتطلبه الـ Request لديك
          label: `${user.firstName} ${user.lastName} (${user.email})`,
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

  // جلب الوكلاء عند فتح المودال
  useEffect(() => {
    if (isOpen) {
      fetchAgents();
    }
  }, [isOpen]);

  // دالة التعامل مع تغيير الـ Select للوكلاء
  const handleSelectAgentChange = (selectedOption) => {
    setSelectedAgent(selectedOption);
    setFormData(prev => ({
      ...prev,
      targetAgentIdentity: selectedOption ? selectedOption.value : ''
    }));
  };

  // تخصيص الأنماط لمكتبة react-select لتتطابق مع تصميم الـ Modal الداكن
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#131d3b',
      borderColor: state.isFocused ? '#3b82f6' : '#334155',
      borderRadius: '0.75rem',
      padding: '2px',
      color: '#fff',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#475569'
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#131d3b',
      border: '1px solid #334155',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#2563eb' 
        : state.isFocused 
        ? '#1e293b' 
        : '#131d3b',
      color: '#fff',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#1d4ed8'
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#fff',
    }),
    input: (provided) => ({
      ...provided,
      color: '#fff',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#94a3b8',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.targetAgentIdentity) {
      toast.error("Please select a target agent");
      return;
    }

    setLoading(true);

    const payload = {
      targetAgentIdentity: formData.targetAgentIdentity,
    };

    try {
      
      const response = await transferCallToAgent(callId, formData.targetAgentIdentity, token);

      if (response.success) {
        toast.success(response.message, {
          position: "top-left",
          autoClose: 3000,
          className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
        });
        
        if (onSuccess) await onSuccess(); 
        
        setFormData({ targetAgentIdentity: '' });
        setSelectedAgent(null);
        onClose(); 
      } else {
        toast.error(response.message || "Failed to transfer");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Draggable nodeRef={nodeRef} handle=".drag-header" bounds="body">
      <form 
        ref={nodeRef}
        onSubmit={handleSubmit} 
        className="fixed z-50 w-[360px] min-h-[360px] overflow-auto bg-[#0b1329] text-white rounded-3xl shadow-2xl border border-slate-800/80 p-5 font-sans select-none"
      >
        {/* عنوان المودال القابل للسحب */}
        <div className="drag-header cursor-move flex justify-between items-center border-b border-slate-800 pb-4 select-none mb-4">
          <h2 className="text-xl font-semibold text-white">Transfer To Agent</h2>
        </div>

        {/* حقل اختيار الوكيل باستخدام react-select */}
        <div className="mb-5">
          <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
            Select Agent
          </label>
          <Select
            value={selectedAgent}
            options={agentOptions}
            styles={customStyles}
            onChange={handleSelectAgentChange}
            placeholder={agentsLoading ? "Loading agents..." : "Select Agent by Email..."}
            isLoading={agentsLoading}
            className="text-sm"
            isClearable
            required
          />
        </div>

        {/* أزرار الحفظ والإغلاق */}
        <div className="flex justify-end gap-2 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors flex items-center justify-center min-w-[80px]"
          >
            {loading ? <LoadingInButton /> : "Transfer"}
          </button>
        </div>
      </form>
    </Draggable>
  );
};

export default TransferToAgentModal;