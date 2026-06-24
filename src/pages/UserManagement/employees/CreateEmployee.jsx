import React, { useState } from 'react';
import { useDepartments } from '../../../hooks/useDepartments';
import Select from 'react-select';
import { useRoles } from '../../../hooks/useRoles';
import CheckBox from '../../../components/common/CheckBox';
import { createUser } from '../../../services/UserManagement/CreateNewUser';
import { toast } from 'react-toastify';
import LoadingCircle from '../../../components/common/LoadingCircle';
import Button from '../../../components/common/Button';

const CreateEmployee = () => {
  const token = localStorage.getItem('Token');

  const [loading, setLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);

  // 1. إضافة State لإدارة بيانات النموذج (Form Data)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    departmentId: null,
  });

  // جلب بيانات الأقسام
  const { 
    data: departments = [], 
    isLoading: isDepsLoading, 
  } = useDepartments(token,true);

  // جلب بيانات الرولات
  const { 
    data: roles = [], 
    isLoading: isRolesLoading 
  } = useRoles(token);

  // تحضير خيارات الأقسام لتتوافق مع متطلبات react-select (label و value)
  

  // دالة التعامل مع تغيير نصوص الإدخال العادية
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // دالة التعامل مع اختيار القسم من الـ Select
  const handleDepartmentChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      departmentId: selectedOption ? selectedOption.value : null
    }));
  };

  // دالة التحكم في اختيار وإلغاء اختيار الرولات
  const handleRoleChange = (roleId) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter(id => id !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  // 2. دالة إرسال البيانات عند الضغط على زر التثبيت
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // بناء الـ Payload النهائي بشكل صحيح
    const userPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      departmentId: formData.departmentId,
      roleIds: selectedRoles, 
    };
    console.log(userPayload);
    

    // استدعاء السيرفس
    const response = await createUser(userPayload, token);
    
    if (response.success) {
      toast.success(response.message, {
                position: "top-left",
                autoClose: 3000,
                className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
              });
              setFormData({
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              phoneNumber: '',
              departmentId: null,
            });
          // 2. تصفير الـ Roles
          setSelectedRoles([]);
          setLoading(false)
    } else {
      alert(`Error: ${response.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      {/* تحويل الـ Container إلى form للاستفادة من onSubmit */}
      <form onSubmit={handleSubmit} className="bg-[#171A21] rounded-xl border border-[#2A2E37] p-4 w-full max-w-2xl flex flex-col gap-6 shadow-3xl max-h-[80vh] overflow-auto custom-scrollbar">
        
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6">
          <h2 className="text-2xl font-semibold text-white">
            Create The First Employee in System
          </h2>
        </div>

        <div className="px-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          
          {/* Left Column */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">First Name</label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="e.g. Marcus" 
                className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-blue-600 font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Last Name</label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="e.g. Thorne" 
                className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all  placeholder:text-blue-600 font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Phone Number</label>
              <input 
                type="text" 
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+963940772458" 
                className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all  placeholder:text-blue-600 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="m.thorne@luminescence.com" 
                className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all  placeholder:text-blue-600 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Select Department</label>
              <div className="relative">
                <Select
                  value={departments.find(d => d.value === formData.departmentId) || null}
                  options={departments} 
                  styles={customStyles}
                  isLoading={isDepsLoading}
                  onChange={handleDepartmentChange}
                  placeholder="Select a department..."
                />
              </div>
            </div>

            {/* Active Status Toggle */}
           
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Security & Authentication</label>
              <div className="relative">
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Temporary Password" 
                  className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all  placeholder:text-blue-600 font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Roles</label>
              <div className="bg-[#1e293b]/30 rounded-lg border border-slate-800 p-2 space-y-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                
                {isRolesLoading ? (
                  <p className="text-xs text-slate-500 p-2 animate-pulse font-bold ">Loading roles .......</p>
                ) : roles.length === 0 ? (
                  <p className="text-xs text-slate-500 p-2">No roles available</p>
                ) : (
                  roles.map((role) => (
                    <CheckBox
                      key={role.id}
                      id={`role-${role.id}`}
                      label={role.name}
                      name="roles"
                      value={role.id}
                      checked={selectedRoles.includes(role.id)}
                      onChange={() => handleRoleChange(role.id)}
                      classNames={{
                        label: "flex items-center gap-3 p-2 hover:bg-slate-800 rounded cursor-pointer transition-colors group text-sm text-slate-400",
                        
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 flex justify-end items-center gap-6 border-t border-slate-800/50">
          <button type="button" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
            Cancel
          </button>
          <Button 
          type="submit" className="bg-blue-300 hover:bg-blue-400 text-slate-900 px-8 py-3 rounded-lg font-bold text-sm transition-all shadow-lg active:scale-95">
                 {loading ? (
                            <>
                                <LoadingCircle/>
                            </>
                            ):(
                              <p>Generate Account</p> 
                            )}
          </Button>
          <Button
            path={"/ticketing"}
            type="button" className="text-sm font-bold bg-blue-300 hover:bg-blue-400 px-8 py-3 rounded-lg   transition-colors">
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

// الستايليشن الخاص بـ react-select يبقى كما هو بدون تعديل
const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "#1E293B",
    border: "none", 
    boxShadow: "none", 
    minHeight: "30px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#FFFFFF", 
    fontWeight: "bold",
  }),
  menu: (base) => ({
    ...base,
    width: "250px" , 
    backgroundColor: "#1E293B",
    border: "1px solid #334155", 
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
};

export default CreateEmployee;