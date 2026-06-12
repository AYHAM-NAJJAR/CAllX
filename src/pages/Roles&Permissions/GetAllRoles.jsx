import React, { useState } from 'react';
import { useRoles } from '../../hooks/useRoles';
import { Shield, Key, Layers, Info, Users, Briefcase, Settings } from 'lucide-react';
import Button from "../../components/common/Button"
import CreateRoleModal from './Modal/CreateRoleModal';
function GetAllRoles() {
    const token = localStorage.getItem("Token")
    const [isCreateRoleModalOpen,setIsCreateRoleModalOpen] = useState(false)
    const { 
        data: roles = [], 
        isLoading: isRolesLoading ,
        refetch
    } = useRoles(token);

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

    // 1. حالة التحميل (Loading State)
    if (isRolesLoading) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white font-sans">
                <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-[#0D9EF2] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-400 text-sm animate-pulse">Fetching system roles and capabilities...</p>
                </div>
            </div>
        );
    }

    // 2. حالة عدم وجود بيانات (Empty State)
    if (!roles || roles.length === 0) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-slate-400 font-sans p-6">
                <div className="text-center max-w-sm space-y-4 bg-[#101B22] border border-slate-800 p-8 rounded-2xl shadow-xl">
                    <Shield size={48} className="text-slate-600 mx-auto" />
                    <h3 className="text-white font-semibold text-lg">No Roles Found</h3>
                    <p className="text-sm text-slate-500">There are currently no roles defined for this environment or tenant.</p>
                </div>
            </div>
        );
    }

    // 3. الواجهة الأساسية عند اكتمال جلب البيانات
    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200 p-6 md:p-12 font-sans flex justify-center items-start">
            <CreateRoleModal onSuccess={() => refetch()} isOpen={isCreateRoleModalOpen} onClose={setIsCreateRoleModalOpen}  />
            <div className="w-full max-w-6xl space-y-8">
                
                {/* هيدر الصفحة */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800/80 pb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                            <Shield className="text-[#0D9EF2]" size={32} />
                            Role Management
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">
                            Review and configure access control levels, security descriptors, and assigned scope metrics.
                        </p>
                        
                    </div>
                    <div className='flex flex-row items-center justify-center gap-2'>
                    <div className="bg-[#101B22] border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-400 flex items-center gap-2">
                        <Users size={14} className="text-[#0D9EF2]" />
                        Total Active Roles: <span className="text-white font-bold">{roles.length}</span>
                        
                    </div>
                    <Button
                        onClick={()=>setIsCreateRoleModalOpen(true)}
                        className="bg-customButton px-2 py-1 rounded-md text-sm font-bold text-white">
                            Add Role
                        </Button>
                    </div>
                    
                </div>

                {/* شبكة عرض الأدوار الصلاحية (Grid Layout) */}
                <div className="grid grid-cols-1 gap-8">
                    {roles.map((role) => {
                        const groupedPerms = groupPermissionsByModule(role.permissions || []);
                        
                        return (
                            <div 
                                key={role.id} 
                                className="bg-[#101B22] rounded-2xl border border-slate-800/70 shadow-xl transition-all duration-200 hover:border-slate-700/50 flex flex-col lg:flex-row overflow-hidden"
                            >
                                {/* العمود الأيسر: معلومات الدور الأساسية */}
                                <div className="lg:w-1/4 bg-[#0F172A]/40 p-6 border-b lg:border-b-0 lg:border-r border-slate-800/70 flex flex-col justify-between space-y-4">
                                    <div>
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-[#0D9EF2]/10 border border-[#0D9EF2]/20 flex items-center justify-center text-[#0D9EF2]">
                                                <Key size={16} />
                                            </div>
                                            <h2 className="text-xl font-bold text-white tracking-wide">{role.name}</h2>
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
                                                    {/* عنوان الموديل الفرعي */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold bg-[#0F172A] border border-slate-800 text-[#0D9EF2] px-2.5 py-1 rounded-md tracking-wide">
                                                            {moduleName}
                                                        </span>
                                                        <div className="h-px bg-slate-800/80 flex-grow"></div>
                                                    </div>

                                                    {/* قائمة الـ Badges الخاصة بالصلاحيات داخل الموديل */}
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