import React, { useState } from 'react';
import { Building2, CalendarDays, CheckCircle2, XCircle } from 'lucide-react';
import Button from '../../../components/common/Button';

const TenantsCard = ({ tenant ,openUpdate  }) => {
    const [status,setStatus]= useState(false);
  return (
    <div className="bg-secondary  rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 ">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-sky-600">
          <Building2 size={24} />
          <p className="font-mono  p-2  text-white">
          {tenant.tenantId}
            </p>
        </div>
        
        <Button
        onClick={()=>openUpdate(tenant)}
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold 
          ${tenant.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {tenant.active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
          {tenant.active ? 'Active' : 'Inactive'}
        </Button>
      </div>
      
      {/* Body Section */}
      <div className="text-sm text-gray-600 mb-6">
        <h3 className="text-xl rounded border border-gray-100 p-4 text-white font-bold">{tenant.companyName}</h3>
        
      </div>
      
      {/* Footer Section */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <CalendarDays size={14} />
          <span>
            {new Date(tenant.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        
        <button 
       
        className="bg-[#0D9EF2] hover:bg-[#0a86d1] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Edit Tenant
        </button>
      </div>
    </div>
  );
};

export default TenantsCard;