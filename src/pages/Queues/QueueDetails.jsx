import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQueueByDetails } from '../../services/Queue/getOneQueue';
import { deleteQueue } from '../../services/Queue/deleteQueue';
import { useTranslation } from 'react-i18next';

import { UserCheck, Users, Clock, ShieldCheck, ShieldAlert, Key, Edit, Trash2, ArrowLeft, PlusIcon, PhoneCall } from 'lucide-react';
import LoadingInButton from '../../components/common/LoadingInButton';
import AssignAgentToQueueModal from './Modal/AssignAgentToQueueModal';
import { getQueueCalls } from '../../services/Queue/getQueueCalls';
import { deleteQueueCall } from '../../services/Queue/deletecall';
import { deleteAgentfromQueue } from '../../services/Queue/unAssignAgent';

function QueueDetails() {
  const { t } = useTranslation();
  const { qid } = useParams();
  const navigate = useNavigate();
  const [queue, setQueue] = useState(null);
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deletingCallId, setDeletingCallId] = useState(null);
  const [deletingAgentId, setDeletingAgentId] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const token = localStorage.getItem('Token');

  const fetchQueueData = useCallback(async () => {
    if (!qid) return;
    try {
      setLoading(true);
      const queueResult = await getQueueByDetails(qid, token);
      const queueData = queueResult.data;
      setQueue(queueData);

      if (queueData && queueData.queueKey) {
        const callsResult = await getQueueCalls(queueData.queueKey, token);
        setCalls(callsResult.data || []);
      }
    } catch (error) {
      console.error("Failed to load queue data", error);
    } finally {
      setLoading(false);
    }
  }, [qid, token]);

  useEffect(() => {
    fetchQueueData();
  }, [fetchQueueData]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await deleteQueue(qid, token);
      
      if (response.success) {
        navigate('/main/queue/all', { replace: true });
      } else {
        alert(response.message || t('queueDetails.deleteError'));
      }
    } catch (error) {
      console.error("Error deleting queue:", error);
      alert(t('queueDetails.deleteUnexpected'));
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCall = async (callId) => {
    if (!queue || !queue.queueKey) return;
    try {
      setDeletingCallId(callId);
      await deleteQueueCall(queue.queueKey, callId, token);
      setCalls((prevCalls) => prevCalls.filter((call) => call.callId !== callId));
    } catch (error) {
      console.error("Error deleting call:", error);
      alert(t('queueDetails.deleteCallError'));
    } finally {
      setDeletingCallId(null);
    }
  };

  const handleUnassignAgent = async (agentEmail) => {
    if (!queue || !queue.queueKey) return;
    try {
      setDeletingAgentId(agentEmail);
      
      const response = await deleteAgentfromQueue(queue.queueKey, agentEmail, token);

      if (response && response.success) {
        setQueue((prevQueue) => ({
          ...prevQueue,
          assignedAgents: prevQueue.assignedAgents.filter((agent) => agent !== agentEmail)
        }));
      } else {
        alert(response?.message || t('queueDetails.unassignError'));
      }
    } catch (error) {
      console.error("Error unassigning agent:", error);
      alert(t('queueDetails.unassignUnexpected'));
    } finally {
      setDeletingAgentId(null);
    }
  };

  if (loading) {
    return <div className="p-10 text-white min-h-screen bg-[#0B141A] flex items-center justify-center">{t('queueDetails.loading')}</div>;
  }

  if (!queue) {
    return <div className="p-10 text-white min-h-screen bg-[#0B141A] flex items-center justify-center">{t('queueDetails.notFound')}</div>;
  }

  const formattedDate = new Date(queue.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="p-6 md:p-10 bg-primary min-h-screen text-white">
      
      <AssignAgentToQueueModal
        queueKey={qid}
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onSuccess={fetchQueueData}
      />
        
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* زر العودة */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-medium"
        >
          <ArrowLeft size={18} />
          <span>{t('queueDetails.backToQueues')}</span>
        </button>

        {/* الهيدر مع معلومات الكيو وأزرار التحكم */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              {queue.name}
            </h1>
            <div className="flex items-center gap-2 text-slate-400 text-sm font-mono">
              <Key size={16} className="text-[#0D9EF2]" />
              <span>{queue.queueKey}</span>
            </div>
          </div>

          {/* أزرار التعديل والحذف */}
          <div className="flex items-center gap-3">
             <button 
              onClick={() => setIsOpenModal(true)}
              className="flex items-center gap-2 bg-customButton hover:bg-sky-500 text-white border border-[#0D9EF2]/30 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-sm"
            >
              <PlusIcon size={16} />
              {t('queueDetails.assignAgent')}
            </button>
            <button 
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Trash2 size={16} />
              <span>{deleting ? <LoadingInButton/>: t('queueDetails.delete')}</span>
            </button>
          </div>
        </div>

        {/* شبكة البيانات الإحصائية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Status Card */}
          <div className="bg-[#101B22] p-5 rounded-2xl border border-white/5 shadow-lg flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-xs font-medium uppercase tracking-wider mb-1">{t('queueDetails.status')}</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                queue.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}>
                {queue.active ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                {queue.active ? t('queueDetails.active') : t('queueDetails.inactive')}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#1C2933] flex items-center justify-center text-slate-300">
              {queue.active ? <ShieldCheck size={24} className="text-emerald-400" /> : <ShieldAlert size={24} className="text-rose-400" />}
            </div>
          </div>

          {/* Waiting Count Card */}
          <div className="bg-[#101B22] p-5 rounded-2xl border border-white/5 shadow-lg flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-xs font-medium uppercase tracking-wider mb-1">{t('queueDetails.waitingCustomers')}</span>
              <span className="text-2xl font-bold text-white">
                {queue.waitingCount}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#1C2933] flex items-center justify-center text-[#0D9EF2]">
              <UserCheck size={24} />
            </div>
          </div>

          {/* Created Date Card */}
          <div className="bg-[#101B22] p-5 rounded-2xl border border-white/5 shadow-lg flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-xs font-medium uppercase tracking-wider mb-1">{t('queueDetails.createdDate')}</span>
              <span className="text-sm font-semibold text-slate-200">
                {formattedDate}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#1C2933] flex items-center justify-center text-slate-300">
              <Clock size={24} />
            </div>
          </div>

        </div>

        {/* قسم المكالمات المنتظرة (Waiting Calls) */}
        <div className="bg-[#101B22] p-6 rounded-2xl border border-white/5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <PhoneCall size={20} className="text-[#0D9EF2]" />
            <h2 className="text-lg font-semibold text-white">{t('queueDetails.waitingCalls')}</h2>
          </div>

          {calls && calls.length > 0 ? (
            <div className="divide-y divide-white/5">
              {calls.map((call) => (
                <div key={call.callId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1C2933] flex items-center justify-center text-[#0D9EF2]">
                      <PhoneCall size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{call.callerIdentity}</p>
                      <span className="text-xs font-mono text-slate-400">ID: {call.callId}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-slate-400 bg-[#1C2933] px-3 py-1.5 rounded-lg border border-white/5 w-fit">
                      {t('queueDetails.enqueued')}: {new Date(call.enqueuedAt).toLocaleTimeString()}
                    </div>
                    <button
                      onClick={() => handleDeleteCall(call.callId)}
                      disabled={deletingCallId === call.callId}
                      className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                      title={t('queueDetails.deleteCall')}
                    >
                      {deletingCallId === call.callId ? <LoadingInButton /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">{t('queueDetails.noWaitingCalls')}</p>
          )}
        </div>

        {/* قسم الموظفين المعينين (Assigned Agents) */}
        <div className="bg-[#101B22] p-6 rounded-2xl border border-white/5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Users size={20} className="text-[#0D9EF2]" />
            <h2 className="text-lg font-semibold text-white">{t('queueDetails.assignedAgents')}</h2>
          </div>

          {queue.assignedAgents && queue.assignedAgents.length > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              {queue.assignedAgents.map((agent, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 bg-[#1C2933] border border-white/5 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-200"
                >
                  <UserCheck size={16} className="text-[#0D9EF2]" />
                  <span>{agent}</span>
                  
                  <button
                    onClick={() => handleUnassignAgent(agent)}
                    disabled={deletingAgentId === agent}
                    className="ml-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center"
                    title={t('queueDetails.unassignAgent')}
                  >
                    {deletingAgentId === agent ? <LoadingInButton /> : <Trash2 size={15} />}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">{t('queueDetails.noAgents')}</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default QueueDetails;