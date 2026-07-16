import React, { useState } from 'react';
import Modal from 'react-modal';
import Select from 'react-select'; // تأكد من وجود هذا الاستيراد لمكتبة react-select
import Button from '../../../../components/common/Button';
import LoadingInButton from '../../../../components/common/LoadingInButton';
import { createTag } from '../../../../services/CRM/Tags/CreateTag';
import { toast } from 'react-toastify';
import { useTenants } from '../../../../hooks/useTenants';

const CreateTagModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("Token") ;

  const [formData, setFormData] = useState({
    name: '',
    tenantId: '', // أضفنا معرف الـ tenant هنا لحفظه عند الاختيار
  });

  
  const { data: tenants = [] } = useTenants(token);

  
  const tenantOptions = (tenants || []).map(tenant => ({
    value: tenant.tenantId,       
    label: tenant.companyName    
  }));
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // دالة التعامل مع تغيير الـ Select الخاص بالـ tenants
  const handleSelectTenantChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      tenantId: selectedOption ? selectedOption.value : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tenantId) {
      toast.error("Please select a tenant");
      return;
    }

    setLoading(true);
    const name = formData.name;
    const tenantId = formData.tenantId; // جلب الـ ID الذي تم اختياره
        
    try {
      // تمرير الـ name والـ token والـ tenantId للدالة
      const response = await createTag(name, token, tenantId);
      if (response.success) {
        toast.success(response.message, {
          position: "top-left",
          autoClose: 3000,
          className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
        });
        
        setFormData({ name: '', tenantId: '' }); // إعادة تهيئة الحقول 

        if (onSuccess) {
          onSuccess();
        }

        onClose(); 
      } else {
        toast.error(response.message || "Failed to create tag");
      }
    } catch (error) {
      console.log(error);
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
        <h2 className="text-2xl text-center font-semibold text-white">Create TAG</h2>
        
        <div className="space-y-4">
          {/* حقل اسم الـ Tag */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">TAG Name</label>
            <input
              placeholder='ex: High value'
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          
          {/* حقل اختيار الـ Tenant */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Select Tenant</label>
            <Select
              value={tenantOptions.find(opt => opt.value === formData.tenantId)}
              options={tenantOptions}
              styles={customStyles}
              onChange={handleSelectTenantChange}
              placeholder="Select Tenant..."
              className="text-sm"
              isClearable
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-slate-800 pt-6">
          <Button type="button" onClick={onClose} className="text-slate-400 hover:text-white">Cancel</Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg">
            {loading ? <LoadingInButton/> : "Create Tag"}
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
export default CreateTagModal;