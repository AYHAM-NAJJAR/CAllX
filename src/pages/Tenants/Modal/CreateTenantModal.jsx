import React, { useState } from 'react';

import Modal from 'react-modal';
import { toast } from 'react-toastify';

import LoadingInButton from '../../../components/common/LoadingInButton';
import Button from '../../../components/common/Button';
import { CreateTenant } from '../../../services/Tenants/CreateTenant';


// استقبل onSuccess هنا 
const CreateTenantModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("Token");
  
  const [formData, setFormData] = useState({
    tenantId: '',
    companyName: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
        tenantId: formData.tenantId,
        companyName: formData.companyName,
        active: true, 
    };

    try {
      const response = await CreateTenant(payload, token);
      if (response.success) {
        toast.success(response.message, {
          position: "top-left",
          autoClose: 3000,
          className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
        });
        
        // 1. تحديث القائمة في الخلفية فوراً
        if (onSuccess) await onSuccess(); 
        
        // 2. تصفير الفورم لتجهيزه للمرة القادمة
        setFormData({ tenantId: '', companyName: '' }); 
        
        // 3. إغلاق المودال
        onClose(); 
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
      className="outline-none "
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
    >
      <form onSubmit={handleSubmit} className="bg-[#171A21] rounded-xl border border-[#2A2E37] p-8 w-full max-w-lg flex flex-col gap-6 shadow-3xl">
        <h2 className="text-2xl font-semibold text-white">Create New Tenant</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Tenant ID</label>
            <input
              placeholder='oreints-tenant(String)'
              name="tenantId"
              value={formData.tenantId}
              onChange={handleInputChange}
              className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Company Name</label>
            <input
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-slate-800 pt-6">
          {/* تأكد من إضافة type="button" هنا لمنع زر Cancel من عمل submit للفورم بالخطأ */}
          <Button type="button" onClick={onClose} className="text-slate-400 hover:text-white">Cancel</Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg">
            {loading ? <LoadingInButton/> : "Create Tenant"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTenantModal;