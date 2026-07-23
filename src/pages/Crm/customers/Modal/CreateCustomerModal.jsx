import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Select from 'react-select'; // استيراد الـ Select المخصص
import Button from '../../../../components/common/Button';
import LoadingInButton from '../../../../components/common/LoadingInButton';
import { toast } from 'react-toastify';
import { createCustomer } from '../../../../services/CRM/Customers/CreateCustomer';
import { useRoles } from '../../../../hooks/useRoles';
import { getAgents } from '../../../../services/CRM/Customers/getaAents';

// خيارات الـ Type المحدثة
const typeOptions = [
  { value: 'VIP', label: 'VIP' },
  { value: 'Corporate', label: 'Corporate' },
  { value: 'Individual', label: 'Individual' }
];

// خيارات الـ Status المحدثة
const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Lead', label: 'Lead' }
];

const CreateCustomerModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("Token");
  const [agents, setAgents] = useState([]);
  const [isAgentsLoading, setIsAgentsLoading] = useState(false);
  // جلب الأدوار من الكاش
  const { data: roles = [], isLoading: isRolesLoading } = useRoles(token);
  useEffect(() => {
  const fetchAgents = async () => {
    if (!isOpen) return; // لا نقوم بالجلب إذا كان المودال مغلقاً
    setIsAgentsLoading(true);
    try {
      const data = await getAgents(token);
      // نتحقق من أن البيانات عبارة عن مصفوفة قبل تخزينها
      if (Array.isArray(data)) {
        setAgents(data);
      }
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

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    userType: 'CUSTOMER',     
    roleIds: [],          // مصفوفة فارغة في البداية لتخزين الـ IDs المختارة
    ownerAgentId: '',  
    type: 'Individual',   // القيمة الافتراضية
    status: 'Active'      // القيمة الافتراضية
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // معالجة اختيار الأدوار (متعدد)
  const handleRoleChange = (selectedOptions) => {
    const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData(prev => ({
      ...prev,
      roleIds: selectedIds
    }));
  };

  // معالجة اختيار الـ Type والـ Status من الـ Select المخصص
  const handleSelectChange = (selectedOption, fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: selectedOption ? selectedOption.value : ''
    }));
  };

  // تجهيز الأدوار لتناسب React Select
  const roleOptions = roles.map(role => ({
    value: role.id,
    label: role.name
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await createCustomer(formData, token);
      
      if (response.success || response) { 
        toast.success(response.message || "Customer created successfully!", {
          position: "top-left",
          autoClose: 3000,
          className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
        });
        
        // إعادة تعيين النموذج بعد النجاح
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phoneNumber: '',
          userType: 'CUSTOMER',
          roleIds: [],
          ownerAgentId: 87,
          type: 'Individual',
          status: 'Active'
        });

        if (onSuccess) onSuccess(); 
        onClose(); 
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error creating customer.");
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
      <form onSubmit={handleSubmit} className="bg-[#171A21] rounded-xl border border-[#2A2E37] p-8 w-full max-w-2xl flex flex-col gap-6 shadow-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        <div>
          <h2 className="text-2xl text-center font-bold text-white tracking-wide">Create New Customer</h2>
          <p className="text-center text-xs text-gray-400 mt-1">Fill in the information to add a new client system user.</p>
        </div>

        <div className="space-y-4">
          
          {/* Row 1: First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">First Name</label>
              <input
                type="text"
                placeholder="ex: Leo"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Last Name</label>
              <input
                type="text"
                placeholder="ex: Messi"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* Row 2: Email & Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="messi@gmail.com"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="+9655969971"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* Row 3: Password & Customer Type (React Select) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Customer Type</label>
              <Select
                value={typeOptions.find(opt => opt.value === formData.type)}
                options={typeOptions}
                styles={customStyles}
                onChange={(opt) => handleSelectChange(opt, 'type')}
                placeholder="Select Type..."
                className="text-sm"
              />
            </div>
          </div>

          {/* Row 4: Status (React Select) & Roles Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Status</label>
              <Select
                value={statusOptions.find(opt => opt.value === formData.status)}
                options={statusOptions}
                styles={customStyles}
                onChange={(opt) => handleSelectChange(opt, 'status')}
                placeholder="Select Status..."
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Roles</label>
              <Select
                isMulti
                value={roleOptions.filter(option => formData.roleIds.includes(option.value))}
                options={roleOptions} 
                styles={customStyles}
                isLoading={isRolesLoading}
                onChange={handleRoleChange}
                placeholder="Select roles..."
                className="text-sm"
              />
            </div>
          </div>
            {/* Row 5: Owner Agent Selection */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Owner Agent</label>
                <Select
                  value={agentOptions.find(opt => opt.value === formData.ownerAgentId) || null}
                  options={agentOptions}
                  styles={customStyles}
                  isLoading={isAgentsLoading}
                  onChange={(opt) => handleSelectChange(opt, 'ownerAgentId')}
                  placeholder="Select Owner Agent..."
                  className="text-sm"
                  isClearable // يتيح للمستخدم إمكانية إلغاء التحديد وإرجاعه فارغاً
                />
              </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 border-t border-slate-800 pt-6">
          <Button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-white text-sm font-semibold transition-colors"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-[#0D9EF2] hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-500/10 flex items-center justify-center min-w-[140px]"
            disabled={loading}
          >
            {loading ? <LoadingInButton /> : "Create Customer"}
          </Button>
        </div>

      </form>
    </Modal>
  );
};

// تنسيق مخصص لـ react-select متناسق تماماً مع باقي الحقول وتصميم الـ Dark Mode
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

export default CreateCustomerModal;