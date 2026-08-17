import React, { useState } from 'react';
import { Layers, HelpCircle, Key, Tag, CheckCircle2, AlertCircle, List, Headphones } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createQueue } from '../../services/Queue/createQueue';
import LoadingInButton from '../../components/common/LoadingInButton';
import Button from '../../components/common/Button';
import { Outlet, useLocation, useOutletContext } from 'react-router-dom';

function CreateQueue() {
  const { t } = useTranslation();
  const [queueKey, setQueueKey] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const token = localStorage.getItem('Token'); 
  const location = useLocation();
  const isSubCreate = location.pathname.includes("/main/queue/");
    const context = useOutletContext() || {};
  const { toggleSidebar } = context;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    const payload = {
      queueKey,
      name
    };

    try {
      const response = await createQueue(payload, token);
      if (response && response.success) {
        setSuccessMessage(response.message || t('createQueue.successDefault'));
        setQueueKey('');
        setName('');
      } else {
        setErrorMessage(response?.message || t('createQueue.errorDefault'));
      }

    } catch (error) {
      console.error("Caught Error in Component Submit:", error);
      
      if (typeof error === 'string') {
        setErrorMessage(error);
      } else if (error && typeof error === 'object') {
        setErrorMessage(error.message || error.error || t('createQueue.errorDefault'));
      } else {
        setErrorMessage(t('createQueue.errorFallback'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (isSubCreate) {
    return <Outlet/>
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 p-6 md:p-10 flex flex-col items-center justify-start">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div onClick={toggleSidebar}  className=" cursor-pointer p-3.5">
              <Headphones className="w-7 h-7 text-[#0D9EF2]" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">{t('createQueue.title')}</h1>
              <p className="text-slate-400 text-xs md:text-sm mt-0.5">{t('createQueue.subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              path={"/main/queue/all"}
              className="flex items-center gap-2 bg-[#0F172A] border border-slate-700/80 hover:border-[#0D9EF2] text-slate-200 px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all shadow-sm hover:shadow cursor-pointer"
            >
              <List className="w-4 h-4 text-[#0D9EF2]" />
              {t('createQueue.allQueues')}
            </Button>
          </div>
        </div>

        {/* Info Card Section */}
        <div className="bg-[#101B22] border border-slate-800/80 rounded-2xl p-6 md:p-7 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0D9EF2]/5 rounded-full blur-3xl pointer-events-none"></div>
          <h2 className="text-base md:text-lg font-semibold text-[#0D9EF2] flex items-center gap-2.5 mb-3">
            <HelpCircle className="w-5 h-5 flex-shrink-0" /> 
            <span>{t('createQueue.infoTitle')}</span>
          </h2>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            {t('createQueue.infoDesc')}
          </p>
        </div>

        {/* Form Card Section */}
        <div className="bg-[#101B22] border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-4 mb-6">
            <div className="p-2 bg-[#0D9EF2]/10 text-[#0D9EF2] rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">{t('createQueue.sectionTitle')}</h3>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Key className="w-4 h-4 text-[#0D9EF2]" /> {t('createQueue.queueKeyLabel')}
              </label>
              <input
                type="text"
                value={queueKey}
                onChange={(e) => setQueueKey(e.target.value)}
                placeholder={t('createQueue.queueKeyPlaceholder')}
                required
                className="w-full bg-[#0F172A] border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#0D9EF2] focus:ring-1 focus:ring-[#0D9EF2] transition-all text-sm"
              />
              <p className="text-[11px] text-slate-500 mt-1.5">{t('createQueue.queueKeyHint')}</p>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#0D9EF2]" /> {t('createQueue.queueNameLabel')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('createQueue.queueNamePlaceholder')}
                required
                className="w-full bg-[#0F172A] border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#0D9EF2] focus:ring-1 focus:ring-[#0D9EF2] transition-all text-sm"
              />
              <p className="text-[11px] text-slate-500 mt-1.5">{t('createQueue.queueNameHint')}</p>
            </div>

            {/* زر الحفظ المستقر */}
            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: '#0D9EF2' }}
                className="text-white font-medium py-2.5 px-6 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0D9EF2]/25 disabled:opacity-50 cursor-pointer text-sm min-w-[140px]"
              >
                {loading ? <LoadingInButton /> : <span>{t('createQueue.saveButton')}</span>}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default CreateQueue;