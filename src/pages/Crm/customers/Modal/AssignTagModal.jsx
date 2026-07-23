import React, { useState } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import Button from '../../../../components/common/Button';
import LoadingInButton from '../../../../components/common/LoadingInButton';
import { toast } from 'react-toastify';
import { useTags } from '../../../../hooks/useTags';
import { AssignTag } from '../../../../services/CRM/Customers/AssignTag';

const AssignTagModal = ({ isOpen, onClose, onSuccess, customerId }) => {
  const [loading, setLoading] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState('');
  const token = localStorage.getItem("Token");

  // جلب التاغات المتاحة من الـ Hook
  const { data: tags = [] } = useTags(token);

  // تحويل التاغات إلى خيارات متوافقة مع react-select
  const tagOptions = (tags || []).map(tag => ({
    value: tag.id || tag.tagId,       
    label: tag.name || tag.tagName    
  }));

  // التعامل مع تغيير اختيار الـ Tag
  const handleSelectTagChange = (selectedOption) => {
    setSelectedTagId(selectedOption ? selectedOption.value : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTagId) {
      toast.error("Please select a tag");
      return;
    }

    setLoading(true);
        
    try {
      const response = await AssignTag(selectedTagId, token, customerId);
      
      if (response.success) {
        toast.success(response.message || "Tag assigned successfully", {
          position: "top-left",
          autoClose: 3000,
          className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
        });
        
        setSelectedTagId(''); // إعادة تهيئة الحقل 

        if (onSuccess) {
          onSuccess();
        }

        onClose(); 
      } else {
        toast.error(response.message || "Failed to assign tag");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server");
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
        <h2 className="text-2xl text-center font-semibold text-white">Add Tag To Customer</h2>
        
        <div className="space-y-4">
          {/* حقل اختيار الـ Tag */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Select Tag</label>
            <Select
              value={tagOptions.find(opt => opt.value === selectedTagId) || null}
              options={tagOptions}
              styles={customStyles}
              onChange={handleSelectTagChange}
              placeholder="Select Tag..."
              className="text-sm"
              isClearable
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-slate-800 pt-6">
          <Button type="button" onClick={onClose} className="text-slate-400 hover:text-white">Cancel</Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg">
            {loading ? <LoadingInButton/> : "Assign Tag"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// تنسيقات الـ customStyles الخاصة بـ react-select
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
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#0F172A",
    borderRadius: "0.375rem",
    border: "1px solid #334155"
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#FFFFFF",
    fontSize: "12px",
    padding: "2px 6px"
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#94A3B8",
    "&:hover": {
      backgroundColor: "#1E293B",
      color: "#F8FAFC",
      borderRadius: "0.375rem"
    }
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

export default AssignTagModal;