import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { toast } from 'react-toastify';
import Select from 'react-select'; // استيراد مكتبة Select

import LoadingInButton from '../../../components/common/LoadingInButton';
import Button from '../../../components/common/Button';
import { useActiveQueues } from '../../../hooks/useQueues';

const TransferToQueueModal = ({ isOpen, onClose, onSuccess, sourceQueueId }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("Token");
  const nodeRef = useRef(null);

  // جلب الطوابير باستخدام React Query
  const { data: queues = [], isLoading: queuesLoading } = useActiveQueues(token);

  const [formData, setFormData] = useState({
    targetQueueId: '',
  });

  // تجهيز خيارات الـ Select بالمذل وتوافقها مع مكتبة react-select
  const queueOptions = queues.map((queue) => ({
    value: queue.id || queue.value,
    label: queue.name || queue.label,
  }));

  // دالة التعامل مع تغيير الـ Select
  const handleSelectQueueChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      targetQueueId: selectedOption ? selectedOption.value : ''
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
    
    if (!formData.targetQueueId) {
      toast.error("Please select a target queue");
      return;
    }

    setLoading(true);

    const payload = {
      sourceQueueId: sourceQueueId || "", 
      targetQueueId: formData.targetQueueId,
    };

    try {
      const response = { success: true, message: "Transferred successfully" };

      if (response.success) {
        toast.success(response.message, {
          position: "top-left",
          autoClose: 3000,
          className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
        });
        
        if (onSuccess) await onSuccess(); 
        
        setFormData({ targetQueueId: '' }); 
        onClose(); 
      } else {
        toast.error(response.message || "Failed to transfer queue");
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
          <h2 className="text-xl font-semibold text-white">Select Queue To transfer</h2>
        </div>

        {/* قائمة اختيار الكيو باستخدام react-select */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Target Queue
          </label>
          <Select
            value={queueOptions.find(opt => opt.value === formData.targetQueueId) || null}
            options={queueOptions}
            styles={customStyles}
            onChange={handleSelectQueueChange}
            placeholder={queuesLoading ? "Loading queues..." : "Select a queue..."}
            className="text-sm"
            isLoading={queuesLoading}
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

export default TransferToQueueModal;