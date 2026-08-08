import React, { useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

import LoadingInButton from '../../../components/common/LoadingInButton';
import Button from '../../../components/common/Button';

import { useTenants } from '../../../hooks/useTenants';
import { CreateAdminTenantF } from '../../../services/Tenants/CreateAdminTenant';


const CreateAdminTenant = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("Token");

  const { data: tenants = [] } = useTenants(token);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    tenantId: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      tenantId: formData.tenantId,
      roleIds: [1], // مثبتة تلقائياً
    };

    try {
      const response = await CreateAdminTenantF(payload, token);
      if (response.success) {
        toast.success(response.message, {
          position: "top-left",
          autoClose: 3000,
          className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
        });
        
        if (onSuccess) await onSuccess(); 
        
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phoneNumber: '',
          tenantId: '',
        }); 
        
        onClose(); 
      } else {
        toast.error(response.message || "Failed to create admin tenant");
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
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="bg-[#171A21] rounded-xl border border-[#2A2E37] p-8 w-full max-w-2xl flex flex-col gap-6 shadow-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-white">Create New Admin Tenant</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tenant ID */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Tenant ID</label>
            <select
              name="tenantId"
              value={formData.tenantId}
              onChange={handleInputChange}
              className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Select Tenant</option>
              {tenants.map((t) => (
                <option key={t.id || t.tenantId} value={t.tenantId}>
                  {t.tenantId} - {t.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* First Name */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">First Name</label>
            <input
              placeholder="momo"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Last Name</label>
            <input
              placeholder="nad"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Email</label>
            <input
              type="email"
              placeholder="chatfffd@gmail.com"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Phone Number</label>
            <input
              placeholder="+9637869971"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-slate-800 pt-6">
          <Button type="button" onClick={onClose} className="text-slate-400 hover:text-white">Cancel</Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg">
            {loading ? <LoadingInButton /> : "Create Tenant"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateAdminTenant;