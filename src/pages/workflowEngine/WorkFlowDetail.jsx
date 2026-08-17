import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRuleById } from '../../services/workflowEngine/getOneRule';
import Button from '../../components/common/Button';
import { deleteFlow } from '../../services/workflowEngine/deleteWorkflow';
import { toast } from 'react-toastify';
import { ActivateFlow } from '../../services/workflowEngine/activateFlow';
import WorkFlowUpdateModal from './Modal/UpdateModalEngine';
import LoadingCircle from '../../components/common/LoadingCircle';
import LoadingError from '../../components/common/LoadingError';

const WorkFlowDetail = () => {
  const { id } = useParams();
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("Token");
  const GO = useNavigate();
  
  // 1. تعريف حالة فتح وإغلاق المودال
  const [workFlowUpdateOpen, setWorkFlowUpdateOpen] = useState(false);

  // 2. فصل دالة جلب البيانات لتتمكن من استدعائها وقتما شئت (عند التحديث أو التحميل الأولي)
  const fetchWorkflowDetail = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const currentToken = localStorage.getItem('Token') || token || '';
      const data = await getRuleById(currentToken, id);
      setWorkflow(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch workflow details');
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchWorkflowDetail();
  }, [fetchWorkflowDetail]);

  // دالة تُنفذ تلقائياً عند نجاح التعديل من داخل المودال
  const handleSaveSuccess = async () => {
    toast.success("Workflow updated successfully", {
      position: "top-left",
      autoClose: 3000,
      className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
    });
    // إعادة جلب البيانات الحديثة مباشرة لتحديث الشاشة
    await fetchWorkflowDetail();
  };

  async function handleDelete() {
    const response = await deleteFlow(id, token);
    if (response) {
      toast.success(response.message, {
        position: "top-left",
        autoClose: 3000,
        className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
      });
      GO("/main/workengine");  
    }
  }

  async function handleActivate() {
    const response = await ActivateFlow(id, token);
    if (response) {
      toast.success(response.message, {
        position: "top-left",
        autoClose: 3000,
        className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
      });
      GO("/main/workengine");  
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingCircle Phrase={"Rule"} />;
  }

  if (error) {
    return <LoadingError Phrase={"Rule"} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* Header Section */}
      <div className="flex flex-col gap-6 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
              Workflow Engine / ID: #{workflow?.id}
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">•</span>
            <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
              Created on {formatDate(workflow?.createdAt)}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white break-words">{workflow?.name}</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 break-words">{workflow?.description}</p>
        </div>
        
        {/* Status Bar & Action Buttons */}
        <div className='w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4'>
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-semibold text-slate-300 bg-[#101B22] px-3 sm:px-4 py-1.5 rounded-full border border-slate-800 shrink-0">
              Priority {workflow?.priority}
            </span>
            <span className={`px-3 py-1 rounded-md text-xs font-medium shrink-0 ${workflow?.active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400'}`}>
              {workflow?.active ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className='flex flex-wrap items-center gap-2 w-full lg:w-auto'>
            <Button
              onClick={() => setWorkFlowUpdateOpen(true)}
              className="flex-1 sm:flex-none bg-customButton inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-medium text-white rounded-full shadow-sm transition-all duration-200 hover:brightness-110 active:scale-95"
            >
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              className="flex-1 sm:flex-none bg-red-600 inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-medium text-white rounded-full shadow-sm transition-all duration-200 hover:brightness-110 active:scale-95"
            >
              Delete
            </Button>
            <Button
              onClick={handleActivate}
              className="flex-1 sm:flex-none bg-gray-700 inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-medium text-white rounded-full shadow-sm transition-all duration-200 hover:brightness-110 active:scale-95"
            >
              Activate
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        
        {/* Conditions Card */}
        <div style={{ backgroundColor: '#101B22' }} className="p-4 sm:p-6 rounded-2xl border border-slate-800">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#0D9EF2]"></span>
            Conditions (IF)
          </h2>
          <div className="space-y-3">
            {workflow?.conditions?.map((condition) => (
              <div key={condition.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0F172A] p-3 sm:p-4 rounded-xl border border-slate-800/60 text-xs sm:text-sm">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span className="text-slate-500 font-mono">#{condition.displayOrder}</span>
                  <span className="text-[#0D9EF2] font-semibold break-all">{condition.coreField}</span>
                  <span className="text-slate-400 font-mono text-xs">{condition.operator}</span>
                </div>
                <span className="bg-slate-800 px-3 py-1 rounded-md text-slate-200 font-medium self-start sm:self-auto break-all">
                  {condition.expectedValue}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions Card */}
        <div style={{ backgroundColor: '#101B22' }} className="p-4 sm:p-6 rounded-2xl border border-slate-800">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Actions (THEN)
          </h2>
          <div className="space-y-3">
            {workflow?.actions?.map((action) => (
              <div key={action.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0F172A] p-3 sm:p-4 rounded-xl border border-slate-800/60 text-xs sm:text-sm">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span className="text-slate-500 font-mono">#{action.displayOrder}</span>
                  <span className="text-green-400 font-semibold break-all">{action.actionType}</span>
                  {action.coreField && <span className="text-slate-400 text-xs break-all">({action.coreField})</span>}
                </div>
                <span className="bg-slate-800 px-3 py-1 rounded-md text-slate-200 font-medium self-start sm:self-auto break-all">
                  {action.targetValue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    
      {/* Update Modal */}
      {workFlowUpdateOpen && (
        <WorkFlowUpdateModal
          isOpen={workFlowUpdateOpen} 
          onClose={() => setWorkFlowUpdateOpen(false)} 
          workflowData={workflow}
          token={token}
          ruleId={id}
          onSaveSuccess={handleSaveSuccess}
        />
      )} 
    </div>
  );
};

export default WorkFlowDetail;