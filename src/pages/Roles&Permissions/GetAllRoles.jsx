import React, { useState } from 'react';
import { useRoles } from '../../hooks/useRoles';
import { Shield, Key, Layers, Info, Users, Briefcase, Settings, Edit, Trash2 } from 'lucide-react';
import Button from "../../components/common/Button"
import CreateRoleModal from './Modal/CreateRoleModal';
import UpdateRoleModal from './Modal/UpdateRoleModal'; 
import LoadingCircle from '../../components/common/LoadingCircle';
import LoadingError from '../../components/common/LoadingError';

import { toast } from 'react-toastify';
import { deleteRole } from '../../services/Role&Permission/DeleteRole';
import { SearchInput } from '../../components/common/SearchInput';

function GetAllRoles() {
    const token = localStorage.getItem("Token")
    const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
    const [isUpdateRoleModalOpen, setIsUpdateRoleModalOpen] = useState(false);
    const [selectedRoleForEdit, setSelectedRoleForEdit] = useState(null);
    const [search, setSearch] = useState("");
    const { 
        data: roles = [], 
        isLoading, 
        isError,
        refetch
    } = useRoles(token, false, search);

    // دالة مساعدة لتجميع الصلاحيات حسب الموديل (Module) لشكل أكثر تنظيماً
    const groupPermissionsByModule = (permissions) => {
        return permissions.reduce((acc, current) => {
            const moduleName = current.module || 'GENERAL';
            if (!acc[moduleName]) {
                acc[moduleName] = [];
            }
            acc[moduleName].push(current);
            return acc;
        }, {});
    };

    // دالة حذف الدور (Delete Role) باستخدام خدمة deleteRole الخارجية
    const handleDeleteRole = async (roleId) => {
        

        try {
            const result = await deleteRole(roleId, token);

            if (result.success) {
                toast.success(result.message || "Role deleted successfully", {
                    position: "top-left",
                    autoClose: 3000,
                    className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl text-white',
                });
                refetch(); // إعادة جلب البيانات بعد الحذف بنجاح
            } else {
                toast.error(result.message || "Failed to delete role", {
                    position: "top-left",
                    autoClose: 3000,
                    className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl text-white',
                });
            }
        } catch (error) {
            toast.error("An unexpected error occurred", {
                position: "top-left",
                autoClose: 3000,
                className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl text-white',
            });
        }
    };

    // فتح مودل التعديل وتمرير بيانات الدور
    const handleOpenEditModal = (role) => {
        setSelectedRoleForEdit({
            id: role.id,
            name: role.name,
            // تمرير صلاحيات الدور الحالية بدلاً من مصفوفة فارغة لكي تظهر محددة مسبقاً في التعديل
            permissionIds: role.permissions ? role.permissions.map(p => p.id) : [] 
        });
        setIsUpdateRoleModalOpen(true);
    };
    
    if (isLoading) {
        return <LoadingCircle Phrase={"Roles"}/>;
    }

    if (isError) {
        return <LoadingError Phrase={"Roles"}/>;
    }

    

    // 3. الواجهة الأساسية عند اكتمال جلب البيانات
    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200 p-6 md:p-12 font-sans flex justify-center items-start">
            <CreateRoleModal 
                onSuccess={() => refetch()} 
                isOpen={isCreateRoleModalOpen} 
                onClose={() => setIsCreateRoleModalOpen(false)} 
            />          

            <UpdateRoleModal 
                isOpen={isUpdateRoleModalOpen} 
                onClose={() => {
                    setIsUpdateRoleModalOpen(false);
                    setSelectedRoleForEdit(null);
                }} 
                roleData={selectedRoleForEdit}
                onSuccess={() => refetch()} 
            />          

            <div className="w-full max-w-6xl space-y-8">
                
                {/* هيدر الصفحة */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800/80 pb-6 gap-4">
                    <div className='felx  flex-col'>
                        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                            <Shield className="text-[#0D9EF2]" size={32} />
                            Role Management
                        </h1>
                        <div>
                            <p className="text-sm text-slate-400 mt-1">
                            Review and configure access control levels, security descriptors, and assigned scope metrics.
                        </p>
                        <div className="bg-[#101B22] border border-slate-800 px-4 py-2 w-fit rounded-xl mt-2 text-xs text-slate-400 flex items-center gap-2">
                            <Users size={14} className="text-[#0D9EF2]" />
                            Total Active Roles: <span className="text-white font-bold">{roles.length}</span>
                        </div>
                        </div>
                    </div>
                    <div className='flex flex-row items-center justify-center gap-2'>
                        
                        <Button
                            onClick={() => setIsCreateRoleModalOpen(true)}
                            className="bg-customButton px-4 py-2 rounded-md text-sm font-bold text-white">
                            Add Role
                        </Button>
                           <SearchInput
                        placeholder={"Search About Role name"} 
                        value={search} 
                        onChange={(val) => {
                        setSearch(val);
                    }} 
                  />
                    </div>
                 
                </div>
                    
                {/* شبكة عرض الأدوار الصلاحية (Grid Layout) */}
                <div className="grid grid-cols-1 gap-8">
                    
                    {roles.map((role) => {
                        const groupedPerms = groupPermissionsByModule(role.permissions || []);
                        
                        return (
                            <div 
                                key={role.id} 
                                className="bg-[#101B22] rounded-2xl border border-slate-800/70 shadow-xl transition-all duration-200 hover:border-slate-700/50 flex flex-col lg:flex-row overflow-hidden relative"
                            >
                                {/* العمود الأيسر: معلومات الدور الأساسية */}
                                <div className="lg:w-1/4 bg-[#0F172A]/40 p-6 border-b lg:border-b-0 lg:border-r border-slate-800/70 flex flex-col justify-between space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-lg bg-[#0D9EF2]/10 border border-[#0D9EF2]/20 flex items-center justify-center text-[#0D9EF2]">
                                                    <Key size={16} />
                                                </div>
                                                <h2 className="text-xl font-bold text-white tracking-wide">{role.name}</h2>
                                            </div>
                                            
                                            {/* أزرار التعديل والحذف داخل الكارد */}
                                            <div className="flex items-center gap-1.5">
                                                <button 
                                                    onClick={() => handleOpenEditModal(role)}
                                                    className="p-1.5 bg-slate-800/60 hover:bg-[#0D9EF2]/20 text-slate-300 hover:text-[#0D9EF2] rounded-lg transition-colors"
                                                    title="Update Role"
                                                >
                                                    <Edit size={15} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteRole(role.id)}
                                                    className="p-1.5 bg-slate-800/60 hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-lg transition-colors"
                                                    title="Delete Role"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                                            {role.description || <span className="italic text-slate-600">No description provided for this role.</span>}
                                        </p>
                                    </div>

                                    {/* تفاصيل الميتا داتا الإضافية */}
                                    <div className="space-y-2 pt-4 border-t border-slate-800/50 text-xs text-slate-500">
                                        <div className="flex justify-between">
                                            <span>Role ID:</span>
                                            <span className="text-slate-400 font-mono">#{role.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tenant Scope:</span>
                                            <span className="text-slate-400 font-mono">ID_{role.tenantId}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Key Actions:</span>
                                            <span className="text-[#0D9EF2] font-semibold">{role.permissions?.length || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* العمود الأيمن: عرض الصلاحيات مجمعة حسب الموديل */}
                                <div className="lg:w-3/4 p-6 space-y-6">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                        <Layers size={14} className="text-[#0D9EF2]" />
                                        Capability & Permission Tree
                                    </h3>

                                    {role.permissions && role.permissions.length > 0 ? (
                                        <div className="space-y-6">
                                            {Object.entries(groupedPerms).map(([moduleName, perms]) => (
                                                <div key={moduleName} className="space-y-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold bg-[#0F172A] border border-slate-800 text-[#0D9EF2] px-2.5 py-1 rounded-md tracking-wide">
                                                            {moduleName}
                                                        </span>
                                                        <div className="h-px bg-slate-800/80 flex-grow"></div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {perms.map((perm) => (
                                                            <div 
                                                                key={perm.id} 
                                                                className="bg-[#0F172A] border border-slate-800/60 rounded-xl p-3 flex items-start gap-3 hover:border-slate-800 transition-all group"
                                                            >
                                                                <div className="w-2 h-2 rounded-full bg-[#0D9EF2] mt-1.5 shrink-0 shadow-sm shadow-[#0D9EF2]/50"></div>
                                                                <div className="space-y-0.5">
                                                                    <div className="text-xs font-mono font-bold text-slate-200 group-hover:text-white transition-colors">
                                                                        {perm.code}
                                                                    </div>
                                                                    <p className="text-xs text-slate-500 leading-normal">
                                                                        {perm.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-[#0F172A] border border-slate-800/40 rounded-xl p-6 text-center text-sm text-slate-500 italic flex items-center justify-center gap-2">
                                            <Info size={14} />
                                            This role has no atomic actions or permissions attached to it.
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}

export default GetAllRoles;