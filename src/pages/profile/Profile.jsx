import React, { useState } from 'react';
import { User, Shield, Mail, Key, Globe, CheckCircle } from 'lucide-react'; 

const Profile = () => {
    // Safely retrieve user data synchronously during state initialization
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Safely retrieve permissions data synchronously during state initialization
    const [permissions, setPermissions] = useState(() => {
        const storedPermissions = localStorage.getItem("permissions");
        return storedPermissions ? JSON.parse(storedPermissions) : [];
    });

    // Loading/Fallback state if no user data is found in localStorage
    if (!user) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white font-sans">
                <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-[#0D9EF2] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-400 text-sm animate-pulse">Loading profile data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200 p-6 md:p-12 flex justify-center items-start font-sans">
            <div className="w-full max-w-4xl space-y-8">
                
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800/80 pb-5 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Profile</h1>
                        <p className="text-sm text-slate-400 mt-1">Manage your account information and access permissions</p>
                    </div>
                    <button className="bg-[#0D9EF2] hover:bg-[#0b8ad3] text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-200 text-sm shadow-lg shadow-[#0D9EF2]/20 flex items-center gap-2">
                        Edit Profile
                    </button>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Sidebar Card: Avatar & Basic Info */}
                    <div className="bg-[#101B22] rounded-2xl p-6 border border-slate-800/60 flex flex-col items-center text-center shadow-xl h-fit">
                        <div className="w-24 h-24 bg-gradient-to-tr from-[#0D9EF2] to-slate-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-inner relative">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                user.firstName?.charAt(0).toUpperCase() || <User size={40} />
                            )}
                            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-[#101B22] rounded-full"></span>
                        </div>
                        
                        <h2 className="text-xl font-semibold text-white mt-4">{user.firstName}{user.lastName}</h2>
                        <span className="text-xs bg-[#0F172A] text-[#0D9EF2] border border-[#0D9EF2]/20 px-3 py-1 rounded-full mt-2 font-medium">
                            {user.type || "Software Engineer"}
                        </span>

                        <hr className="w-full border-slate-800/80 my-6" />

                        <div className="w-full space-y-4 text-sm text-slate-400">
                            <div className="flex items-center gap-3 justify-start">
                                <Mail size={16} className="text-[#0D9EF2] shrink-0" />
                                <span className="truncate">{user.email || "email@example.com"}</span>
                            </div>
                            <div className="flex items-center gap-3 justify-start">
                                <Shield size={16} className="text-[#0D9EF2] shrink-0" />
                                <span>ID: #{user.id}</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Sections */}
                    <div className="md:col-span-2 space-y-6">
                        
                        {/* Account Details Card */}
                        <div className="bg-[#101B22] rounded-2xl p-6 border border-slate-800/60 shadow-xl space-y-6">
                            <h3 className="text-lg font-medium text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
                                <User size={18} className="text-[#0D9EF2]" />
                                Account Details
                            </h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                                <div>
                                    <label className="text-slate-500 block mb-1.5">Full Name</label>
                                    <div className="bg-[#0F172A] p-3 rounded-lg border border-slate-800 text-slate-300">
                                        {user.firstName}{user.lastName}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-slate-500 block mb-1.5">Email Address</label>
                                    <div className="bg-[#0F172A] p-3 rounded-lg border border-slate-800 text-slate-300">
                                        {user.email}
                                    </div>
                                </div>
                                <div>
                                   
                                </div>
                                <div>
                                  
                                </div>
                            </div>
                        </div>

                        {/* Permissions Card */}
                        <div className="bg-[#101B22] rounded-2xl p-6 border border-slate-800/60 shadow-xl space-y-4">
                            <h3 className="text-lg font-medium text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
                                <Key size={18} className="text-[#0D9EF2]" />
                                Assigned Permissions
                            </h3>
                            
                            {permissions && permissions.length > 0 ? (
                                <div className="flex flex-wrap gap-2.5 pt-2">
                                    {permissions.map((permission, index) => (
                                        <span 
                                            key={index} 
                                            className="flex items-center gap-1.5 bg-[#0F172A] hover:bg-slate-950 border border-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg transition-all"
                                        >
                                            <CheckCircle size={12} className="text-[#0D9EF2]" />
                                            {permission}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic pt-2">
                                    No custom permissions assigned to this account.
                                </p>
                            )}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;