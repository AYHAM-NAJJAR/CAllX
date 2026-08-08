import React, { useState, useEffect, useCallback } from 'react';
import { getAllSettings } from '../../services/integration/getAllActiveSettings';
import { toggleSettingStatus } from '../../services/integration/active';

export default function ShowAllSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب البيانات باستخدام useCallback لتجنب إعادة إنشائها بلا داعٍ
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("Token");

    try {
      const response = await getAllSettings(token);
      // التحقق من أن الاستجابة ناجحة وتحتوي على البيانات المطلوبة
      if (response && response.success && Array.isArray(response.data)) {
        setSettings(response.data);
      } else {
        setError(response?.message || "Failed to retrieve settings.");
      }
    } catch (err) {
      setError("An error occurred while fetching settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // دالة لتبديل حالة الـ active وإرسال الطلب للـ API بناءً على الـ key وحالة التفعيل الجديدة
  const handleToggleActive = async (key, currentActiveStatus) => {
    const newActiveStatus = !currentActiveStatus;
    const token = localStorage.getItem("Token");

    // تحديث تفماؤلي (Optimistic Update) للواجهة لضمان سرعة الاستجابة للمستخدم
    setSettings(prevSettings =>
      prevSettings.map(item =>
        item.key === key ? { ...item, active: newActiveStatus } : item
      )
    );

    try {
      const response = await toggleSettingStatus(key, newActiveStatus, token);
      if (!response || !response.success) {
        
        setSettings(prevSettings =>
          prevSettings.map(item =>
            item.key === key ? { ...item, active: currentActiveStatus } : item
          )
        );
        console.error("Failed to update status on server");
      }
      fetchSettings();
    } catch (err) {
      // في حال حدوث خطأ، نقوم بإرجاع الحالة كما كانت
      setSettings(prevSettings =>
        prevSettings.map(item =>
          item.key === key ? { ...item, active: currentActiveStatus } : item
        )
      );
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#101B22] p-10 text-gray-100">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">All Integration Settings</h1>
          <p className="text-sm text-gray-400 mt-1">
            View, manage, and toggle the active status of all configured third-party services.
          </p>
        </div>

        {/* Action Button */}
        
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-400 text-sm animate-pulse">Loading settings...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button 
            onClick={fetchSettings}
            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-xs font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && settings.length === 0 && (
        <div className="flex justify-center items-center py-20 bg-[#0F172A] rounded-2xl border border-gray-800">
          <p className="text-gray-400 text-sm">No integration settings found.</p>
        </div>
      )}

      {/* Settings Grid */}
      {!loading && !error && settings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settings.map((item) => (
            <div 
              key={item.id} 
              className="bg-[#0F172A] rounded-2xl shadow-sm border border-gray-800 p-6 flex flex-col justify-between"
            >
              <div>
                {/* Card Header & Toggle */}
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-800">
                  <div>
                    <span className="text-xs font-semibold text-[#0D9EF2] uppercase tracking-wider">
                      Key: {item.key}
                    </span>
                    <h3 className="text-lg font-semibold text-white mt-0.5">
                      Tenant ID: {item.tenantId}
                    </h3>
                  </div>

                  {/* Active / Inactive Toggle Switch */}
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      item.active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-700/30 text-gray-400 border border-gray-700'
                    }`}>
                      {item.active ? "Active" : "Inactive"}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={item.active} 
                        onChange={() => handleToggleActive(item.key, item.active)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D9EF2]"></div>
                    </label>
                  </div>
                </div>

                {/* Values Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex flex-col bg-[#101B22] p-3 rounded-xl border border-gray-800/60">
                    <span className="text-xs text-gray-400 font-medium">API Key</span>
                    <span className="text-gray-200 font-mono mt-0.5 truncate">{item.value?.apiKey}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col bg-[#101B22] p-3 rounded-xl border border-gray-800/60">
                      <span className="text-xs text-gray-400 font-medium">Auth Domain</span>
                      <span className="text-gray-200 font-mono mt-0.5 truncate">{item.value?.authDomain}</span>
                    </div>

                    <div className="flex flex-col bg-[#101B22] p-3 rounded-xl border border-gray-800/60">
                      <span className="text-xs text-gray-400 font-medium">Project ID</span>
                      <span className="text-gray-200 font-mono mt-0.5 truncate">{item.value?.projectId}</span>
                    </div>
                  </div>

                  <div className="flex flex-col bg-[#101B22] p-3 rounded-xl border border-gray-800/60">
                    <span className="text-xs text-gray-400 font-medium">Messaging Sender ID</span>
                    <span className="text-gray-200 font-mono mt-0.5 truncate">{item.value?.messagingSenderId}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}