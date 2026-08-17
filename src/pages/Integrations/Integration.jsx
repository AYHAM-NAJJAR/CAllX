import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateSetting } from '../../services/integration/createSetting';
import Button from '../../components/common/Button';
import { Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { Menu } from 'lucide-react';

export default function Integration() {
  const { t } = useTranslation();
  const [config, setConfig] = useState({
    key: "",
    value: {
      apiKey: "",
      authDomain: "",
      projectId: "",
      messagingSenderId: ""
    },
    active: true
  });
  const location = useLocation();
  const isSubRoute = location.pathname.includes("/all");
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const context = useOutletContext() || {};
  const { toggleSidebar } = context;

  const handleKeyChange = (val) => {
    setConfig(prev => ({
      ...prev,
      key: val
    }));
  };

  const handleNestedChange = (field, val) => {
    setConfig(prev => ({
      ...prev,
      value: {
        ...prev.value,
        [field]: val
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: "", message: "" });

    // ضع الـ Token الخاص بالمستخدم هنا (يمكن جذبه من localStorage أو Context)
    const token = localStorage.getItem("Token"); 

    try {
      const result = await CreateSetting(config, token);

      if (result.success) {
        setFeedback({ type: "success", message: result.message || t('integration.defaultSuccess') });
        
        setConfig({
          key: "",
          value: {
            apiKey: "",
            authDomain: "",
            projectId: "",
            messagingSenderId: ""
          },
          active: true
        });
      } else {
        setFeedback({ type: "error", message: result.message || t('integration.defaultError') });
      }
    } catch (error) {
      setFeedback({ type: "error", message: t('integration.unexpectedError') });
    } finally {
      setLoading(false);
    }
  };

  if (isSubRoute) {
    return <Outlet />;
  }

  return (
    <div className="w-full min-h-screen bg-[#101B22] p-10 text-gray-100">
      
      {/* Header and Action Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className='flex gap-2'>
           <Button 
          onClick={toggleSidebar} 
          className="p-2 text-slate-300 hover:text-sky-400  rounded-lg transition-all shrink-0"
          aria-label={t('integration.toggleSidebar')}
        >
          <Menu size={22} />
        </Button>
         <div className='flex flex-col '>
           <h1 className="text-2xl font-bold text-white">{t('integration.title')}</h1>
          <p className="text-sm text-gray-400 mt-1">
            {t('integration.subtitle')}
          </p>
         </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Button
            path={"/main/integration/all"} 
            type="button"
            className="px-4 py-2 bg-[#0F172A] border border-gray-800 hover:bg-gray-800 text-gray-300 font-medium rounded-xl text-sm transition-colors shadow-sm"
          >
            {t('integration.showAll')}
          </Button>
        </div>
      </div>

      {/* Metadata / Instructions Section */}
      <div className="bg-[#0F172A] border-l-4 border-[#0D9EF2] p-4 rounded-r-xl mb-6 shadow-sm border border-gray-800">
        <div className="flex items-start">
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-white">{t('integration.instructionsTitle')}</h3>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              {t('integration.instructionsDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Alert Messages */}
      {feedback.message && (
        <div className={`mb-6 p-4 bg-[#0F172A] border rounded-xl text-sm flex items-center justify-between shadow-sm ${
          feedback.type === "success" ? "border-green-500 text-green-400" : "border-red-500 text-red-400"
        }`}>
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Input Form Card */}
      <div className="bg-[#0F172A] rounded-2xl shadow-sm border border-gray-800 p-6 md:p-8">
        
        <div className="flex justify-between items-center pb-5 mb-6 border-b border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-white">{t('integration.firebaseTitle')}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{t('integration.firebaseSubtitle')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Base Key Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">{t('integration.configKeyLabel')}</label>
            <input 
              type="text" 
              value={config.key} 
              onChange={(e) => handleKeyChange(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-[#101B22] border border-gray-800 rounded-xl text-gray-200 focus:ring-2 focus:ring-[#0D9EF2] focus:outline-none text-sm font-mono"
            />
            <p className="text-xs text-gray-400 mt-1">{t('integration.configKeyHint')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* apiKey Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('integration.apiKeyLabel')}</label>
              <div className="relative">
                <input 
                  type={showApiKey ? "text" : "password"}
                  value={config.value.apiKey}
                  onChange={(e) => handleNestedChange('apiKey', e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-[#101B22] border border-gray-800 rounded-xl text-gray-200 focus:ring-2 focus:ring-[#0D9EF2] focus:outline-none text-sm font-mono"
                />
                <button 
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute inset-y-0 right-0 px-3 text-xs text-[#0D9EF2] hover:underline font-medium"
                >
                  {showApiKey ? t('integration.hide') : t('integration.show')}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">{t('integration.apiKeyHint')}</p>
            </div>

            {/* authDomain Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('integration.authDomainLabel')}</label>
              <input 
                type="text"
                value={config.value.authDomain}
                onChange={(e) => handleNestedChange('authDomain', e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#101B22] border border-gray-800 rounded-xl text-gray-200 focus:ring-2 focus:ring-[#0D9EF2] focus:outline-none text-sm font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">{t('integration.authDomainHint')}</p>
            </div>

            {/* projectId Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('integration.projectIdLabel')}</label>
              <input 
                type="text"
                value={config.value.projectId}
                onChange={(e) => handleNestedChange('projectId', e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#101B22] border border-gray-800 rounded-xl text-gray-200 focus:ring-2 focus:ring-[#0D9EF2] focus:outline-none text-sm font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">{t('integration.projectIdHint')}</p>
            </div>

            {/* messagingSenderId Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('integration.messagingSenderIdLabel')}</label>
              <input 
                type="text"
                value={config.value.messagingSenderId}
                onChange={(e) => handleNestedChange('messagingSenderId', e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#101B22] border border-gray-800 rounded-xl text-gray-200 focus:ring-2 focus:ring-[#0D9EF2] focus:outline-none text-sm font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">{t('integration.messagingSenderIdHint')}</p>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-5 border-t border-gray-800 flex justify-end gap-3">
            <button 
              type="button"
              className="px-5 py-2.5 bg-[#101B22] border border-gray-800 hover:bg-gray-800 text-gray-300 font-medium rounded-xl text-sm transition-colors"
            >
              {t('integration.cancel')}
            </button>
            <button 
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#0D9EF2' }}
              className="px-6 py-2.5 hover:opacity-90 text-white font-medium rounded-xl text-sm shadow-sm transition-opacity disabled:opacity-50"
            >
              {loading ? t('integration.saving') : t('integration.saveChanges')}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}