import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRuleById } from '../../services/workflowEngine/getOneRule';
import Button from '../../components/common/Button';
import { deleteFlow } from '../../services/workflowEngine/deleteWorkflow';
import { toast } from 'react-toastify';
import { ActivateFlow } from '../../services/workflowEngine/activateFlow';

const WorkFlowDetail = () => {
  const { id } = useParams();
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("Token")
  const GO = useNavigate();


    async function handleDelete() {
        const response = await deleteFlow(id,token)
        if (response) {
            toast.success(response.message, {
                position: "top-left",
                autoClose: 3000,
                className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
            });
            GO("/main/workengine")  
        }
    }
    async function handleActivate() {
        console.log(id);
        const response = await ActivateFlow(id,token)
        if (response) {
            toast.success(response.message, {
                position: "top-left",
                autoClose: 3000,
                className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
            });
            GO("/main/workengine")  
        }
    }

  useEffect(() => {
    const fetchWorkflowDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('Token') || '';
        const data = await getRuleById(token, id);
        setWorkflow(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch workflow details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchWorkflowDetail();
  }, [id]);

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
    return (
      <div className="flex justify-center items-center py-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D9EF2]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-4 bg-red-950/40 border border-red-500/50 text-red-200 rounded-xl text-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <div className="flex flex-col items-start gap-2 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Workflow Engine / ID: #{workflow?.id}
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-medium">
              Created on {formatDate(workflow?.createdAt)}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">{workflow?.name}</h1>
          <p className="mt-2 text-base text-slate-400">{workflow?.description}</p>
        </div>
        <div className=' w-full flex items-center justify-between '>
            
             <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-300 bg-[#101B22] px-4 py-1.5 rounded-full border border-slate-800">
            Priority {workflow?.priority}
          </span>
          <span className={`px-3 py-1 rounded-md text-xs font-medium ${workflow?.active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400'}`}>
            {workflow?.active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className='flex items-center gap-1 justify-center'>
                <Button
                
                className=" bg-customButton mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white rounded-full shadow-sm transition-all duration-200 hover:brightness-110 active:scale-95"
                >Edit</Button>
                <Button
                onClick={handleDelete}
                className=" bg-red-600 mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white rounded-full shadow-sm transition-all duration-200 hover:brightness-110 active:scale-95"
                >Delete</Button>
                <Button
                onClick={handleActivate}
                className=" bg-gray-700 mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white rounded-full shadow-sm transition-all duration-200 hover:brightness-110 active:scale-95"
                >Activate</Button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div style={{ backgroundColor: '#101B22' }} className="p-6 rounded-2xl border border-slate-800">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#0D9EF2]"></span>
            Conditions (IF)
          </h2>
          <div className="space-y-3">
            {workflow?.conditions?.map((condition) => (
              <div key={condition.id} className="flex items-center justify-between bg-[#0F172A] p-4 rounded-xl border border-slate-800/60 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-mono">#{condition.displayOrder}</span>
                  <span className="text-[#0D9EF2] font-semibold">{condition.coreField}</span>
                  <span className="text-slate-400 font-mono text-xs">{condition.operator}</span>
                </div>
                <span className="bg-slate-800 px-3 py-1 rounded-md text-slate-200 font-medium">
                  {condition.expectedValue}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: '#101B22' }} className="p-6 rounded-2xl border border-slate-800">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Actions (THEN)
          </h2>
          <div className="space-y-3">
            {workflow?.actions?.map((action) => (
              <div key={action.id} className="flex items-center justify-between bg-[#0F172A] p-4 rounded-xl border border-slate-800/60 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-mono">#{action.displayOrder}</span>
                  <span className="text-green-400 font-semibold">{action.actionType}</span>
                  {action.coreField && <span className="text-slate-400 text-xs">({action.coreField})</span>}
                </div>
                <span className="bg-slate-800 px-3 py-1 rounded-md text-slate-200 font-medium">
                  {action.targetValue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkFlowDetail;