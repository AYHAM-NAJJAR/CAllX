import React, {useState } from 'react';

import Button from '../../../components/common/Button';
import { createRoleService } from '../../../services/Role&Permission/createRole';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import role from "../../../assets/role.png"
import { usePermissions } from '../../../hooks/usePermissions';
import LoadingCircle from '../../../components/common/LoadingCircle';

function CreateRoleModal({isOpen , onClose , onSuccess}) {
  const [roleName, setRoleName] = useState('');
  const GO = useNavigate()
  const [loading , setLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const token = localStorage.getItem('Token');
    // 2. جلب البيانات باستخدام Hook الـ React Query الذي أنشأناه
    const { 
    data: permissionsData = [], 
    isLoading, 
    isError 
  } = usePermissions(token);


  const togglePermission = (id) => {
    setSelectedPermissions(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const isAllSelected = selectedPermissions.length === permissionsData.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(permissionsData.map(p => p.id));
    }
  };

  const selectedCount = selectedPermissions.length;
  
    async function handleCreateRole() {
      console.log("اه");
      setLoading(true)
      const response = await createRoleService(roleName,selectedPermissions,token);
      if (response.success) {
        toast.success(response.message, {
          position: "top-left",
          autoClose: 3000,
          className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
        });
        setRoleName("");
        setSelectedPermissions([])
        onSuccess();
        onClose();
        setLoading(false)
        console.log("اه");
      }
    }
  return (
     <Modal
                isOpen={isOpen}
                onRequestClose={onClose}
                className="outline-none"
                overlayClassName="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
            >
                        
       
      <div className="bg-[#171A21] rounded-xl border border-[#2A2E37] p-4 w-full max-w-2xl flex flex-col gap-6 shadow-3xl max-h-[80vh] overflow-auto custom-scrollbar">
        
        <div>
          <h1 className="text-2xl font-semibold text-[#FFFFFF] mb-1">Create New Role</h1>
          <p className="text-sm text-[#999999]">Define permissions and access levels for a new organizational role.</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[#FFFFFF]" htmlFor="roleName">Role Name</label>
            <span className="text-xs text-[#F87171]">*Required</span>
          </div>
          <input
            id="roleName"
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full bg-[#111318] border border-[#2A2E37] rounded-lg px-4 py-2.5 text-sm text-[#FFFFFF] outline-none focus:ring-1 focus:ring-[#6366F1] transition"
          />
          <p className="text-xs text-[#777777] mt-2">Avoid generic names like 'Admin' or 'Staff'. Be specific.</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-[#FFFFFF]">Permissions</h2>
              <span className="bg-[#1D4ED8] text-[#FFFFFF] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Granular Access</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" placeholder="Filter..." className="bg-[#2A2E37] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#FFFFFF] outline-none w-48" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#FFFFFF]">Select All</span>
                <button
                  onClick={toggleSelectAll}
                  className={`${isAllSelected ? 'bg-[#6366F1]' : 'bg-[#555555]'} relative inline-flex h-5 w-10 items-center rounded-full transition-colors outline-none`}
                >
                  <span className={`${isAllSelected ? 'translate-x-5' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition-transform`} />
                </button>
              </div>
            </div>
          </div>
          {
            isLoading ? (
            <div className="w-full max-w-sm flex justify-center items-center">
              <p className="text-blue-400 animate-pulse text-center p-10 ">Loading Permissions...</p>
            </div>
          ) :
            (
              (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 mb-6">
            {permissionsData.map((permission) => {
              const isSelected = selectedPermissions.includes(permission.id);
              return (
                <div
                  key={permission.id}
                  onClick={() => togglePermission(permission.id)}
                  className={`bg-[#1A1D24] border min-w-fit ${isSelected ? 'border-[#6366F1]' : 'border-[#2A2E37]'} rounded-xl p-3.5 flex items-start gap-3 cursor-pointer hover:border-[#6366F1] transition`}
                >
                  <div className={`w-5 h-5 flex-shrink-0 rounded border ${isSelected ? 'bg-[#6366F1] border-[#6366F1]' : 'bg-[#2A2E37] border-[#3F4451]'} flex items-center justify-center mt-0.5 transition`}>
                    {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#FFFFFF] mb-0.5">{permission.code}</h3>
                    <p className="text-[11px] text-[#999999] leading-tight">{permission.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
            )
            )
          }
         

          <div className="bg-[#E0E7FF] rounded-lg px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-sm text-[#111827]">Selected: <strong className="font-bold">{selectedCount} permissions</strong></span>
            </div>
            <span className="text-[11px] text-[#374151]">Changes saved to local buffer</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mt-2 pt-6 border-t border-[#2A2E37]">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#F87171]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <p className="text-xs text-[#F87171]">Users will be updated instantly.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2 rounded-lg text-sm font-medium border border-[#3F4451] hover:bg-[#2A2E37] transition text-[#FFFFFF]">Cancel</button>
            <Button 
            className="px-5 py-2 rounded-lg text-sm font-medium bg-[#A5B4FC] hover:bg-[#C7D2FE] transition text-[#111827]"
            onClick={handleCreateRole}
            >

                 {loading ? (
                            <>
                                <LoadingCircle/>
                            </>
                            ):(
                                <p>Create Role</p>
                            )}
            </Button>
          </div>
        </div>
      </div>



            </Modal>
  );
}

export default CreateRoleModal;