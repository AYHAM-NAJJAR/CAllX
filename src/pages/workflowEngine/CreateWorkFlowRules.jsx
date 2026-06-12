import React, { useState } from 'react';
import Select from 'react-select'; 
import { Info, SlidersHorizontal, Play, Trash2, Plus } from 'lucide-react';
import Button from '../../components/common/Button';
import WorkFlowEngineInfoModal from './Modal/WorkFlowEngineInfoModal';

// استيراد الـ Enums من ملف الثوابت المعزول
import { CoreField, Operator, TicketPriority, WorkflowActionType, TicketStatus } from '../../constants/workflowEnums';
import { useDepartments } from '../../hooks/useDepartments';
import { useEmployees } from '../../hooks/useEmployees';
import { createWorkflowRule } from '../../services/workflowEngine/createWorkflowRule';
import { toast } from 'react-toastify';
import LoadingCircle from '../../components/common/LoadingCircle';


export function CreateWorkFlowRules() {
  const token = localStorage.getItem("Token")
  const [ruleName, setRuleName] = useState('');
  const [isInfoWorkFlowEngineOpen, setIsInfoWorkFlowEngineOpen] = useState(false);
  const [priority, setPriority] = useState({ value: '2', label: 'Priority 2 (Normal)' });
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState('');
  
  const [conditions, setConditions] = useState([]);
  const [actions, setActions] = useState([]);
   const { 
      data: departments = [], 
    } = useDepartments(token,true);
    const { data: employees=[], } = useEmployees(token,true);
    console.log(employees);
  const priorityTierOptions = [
    { value: '1', label: 'Priority 1 (Low)' },
    { value: '2', label: 'Priority 2 (Normal)' },
    { value: '3', label: 'Priority 3 (Medium)' },
    { value: '4', label: 'Priority 4 (High)' },
    { value: '5', label: 'Priority 5 (Critical)' },
  ];

  const coreFieldOptions = Object.values(CoreField).map(field => ({
    value: field,
    label: field.replace('_', ' ') 
  }));

  const operatorOptions = Object.values(Operator).map(op => ({
    value: op,
    label: op.replace(/_/g, ' ') 
  }));

  const actionTypeOptions = Object.values(WorkflowActionType).map(at => ({
    value: at,
    label: at.replace(/_/g, ' ')
  }));

  
  const getDynamicOptions = (selectedField) => {
    if (!selectedField) return [];

    switch (selectedField.value) {
      case CoreField.PRIORITY:
        return Object.values(TicketPriority).map(p => ({ value: p, label: p }));
        
      case CoreField.STATUS:
        return Object.values(TicketStatus).map(s => ({ value: s, label: s.replace('_', ' ') }));
        
      case CoreField.DEPARTMENT:
        return departments;
        
      case CoreField.CURRENT_OWNER:
        return employees;
      default:
        return []; // للحقول النصية المفتوحة (TITLE, DESCRIPTION)
    }
  };

  
  // --- إدارة الـ Conditions ---
  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        id: Date.now(),
        fieldDefinitionId: null,
        coreField: null, 
        operator: null,   
        expectedValue: null, 
      }
    ]);
  };

  const removeCondition = (id) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const updateCondition = (id, key, selectedOption) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, [key]: selectedOption } : c));
  };

  // --- إدارة الـ Actions ---
  const addAction = () => {
    setActions([
      ...actions,
      {
        id: Date.now(),
        actionType: null, 
        fieldDefinitionId: null,
        coreField: null,
        targetValue: null, 
      }
    ]);
  };

  const removeAction = (id) => {
    setActions(actions.filter(a => a.id !== id));
  };

  const updateAction = (id, key, selectedOption) => {
    setActions(actions.map(a => a.id === id ? { ...a, [key]: selectedOption } : a));
  };

  // --- دالة التصدير النهائي (Payload Generator) ---
  const handleSave = async () => {
    const formattedConditions = conditions.map((cond, index) => ({
      fieldDefinitionId: cond.fieldDefinitionId,
      coreField: cond.coreField?.value || null,
      operator: cond.operator?.value || null,
      expectedValue: cond.expectedValue?.value || cond.expectedValue || "", 
      displayOrder: index + 1
    }));

    const formattedActions = actions.map((act, index) => ({
      actionType: act.actionType?.value || null,
      fieldDefinitionId: act.fieldDefinitionId,
      coreField: act.coreField?.value || null,
      targetValue: act.targetValue?.value || act.targetValue || "", 
      displayOrder: index + 1
    }));

    const requestPayload = {
      name: ruleName,
      description: description,
      priority: Number(priority?.value || 2),
      active: true,
      conditions: formattedConditions,
      actions: formattedActions
    };
    const response = await createWorkflowRule(requestPayload,token);
    if (response.success) {
        toast.success(response.message, {
                      position: "top-left",
                      autoClose: 3000,
                      className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
                    });
                setConditions([])
                setActions([])
                setRuleName("")
                setDescription("")
                setPriority({})
                setLoading(false)
    }
    console.log("Exported Payload JSON:", JSON.stringify(requestPayload, null, 2));
  };

  return (
    <div className="min-h-screen bg-primary text-slate-100 p-8 font-sans antialiased">
      <WorkFlowEngineInfoModal isOpen={isInfoWorkFlowEngineOpen} onClose={() => setIsInfoWorkFlowEngineOpen(false)}  />
      
      <div className="mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Workflow Rule</h1>
            <p className="text-sm text-slate-400 mt-1">Automate your ticketing processes by defining conditions and subsequent actions.</p>
          </div>
          <div className="flex items-center gap-3 self-end md:self-auto">
            <Button
              onClick={() => setIsInfoWorkFlowEngineOpen(true)}
              className="px-5 py-2 text-sm font-medium text-slate-300 bg-transparent border border-slate-700 rounded-lg hover:bg-slate-800 transition"
            >
              Information
            </Button>
           <Button 
           onClick={handleSave}
           className="bg-customButton hover:bg-blue-400 text-slate-900 px-8 py-3 rounded-lg font-bold text-sm transition-all shadow-lg active:scale-95">
                 {loading ? (
                            <>
                                <LoadingCircle/>
                            </>
                            ):(
                              <p>Create Rule</p> 
                            )}
          </Button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-col gap-6 mt-8">
          
          {/* Basic Information Block */}
          <div className="bg-[#111726] w-full border border-slate-800 rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <Info className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-2">Rule Name</label>
                <input 
                  type="text" 
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g., Escalation for Enterprise VIPs" 
                  className="w-full bg-[#182032] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Priority Tier</label>
                <Select 
                  value={priority}
                  options={priorityTierOptions} 
                  styles={customSelectStyles}
                  onChange={(selected) => setPriority(selected)}
                  placeholder="Select a priority..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Description</label>
              <textarea 
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the purpose of this rule..." 
                className="w-full bg-[#182032] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none"
              />
            </div>
          </div>

          {/* Core Workflow Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Conditions Block (IF) */}
            <div className="bg-[#111726] border border-slate-800 border-l-4 border-l-emerald-500 rounded-xl p-6 shadow-xl h-fit">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-emerald-500/10 rounded">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-200">Conditions (IF)</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Rule triggers when these match</p>
                  </div>
                </div>
                <button 
                  onClick={addCondition}
                  className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Condition
                </button>
              </div>

              <div className="space-y-3">
                {conditions.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-4">No conditions added yet.</p>
                ) : (
                  conditions.map((condition) => {
                    const dynamicOptions = getDynamicOptions(condition.coreField);
                    return (
                      <div key={condition.id} className="bg-[#161F30] border border-slate-700/60 rounded-lg p-4 flex flex-col sm:flex-row items-end sm:items-center gap-3">
                        <div className="w-full sm:flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Field</label>
                            <Select 
                              value={condition.coreField}
                              options={coreFieldOptions} 
                              styles={customSelectStyles}
                              onChange={(selected) => {
                                updateCondition(condition.id, 'coreField', selected);
                              }}
                              placeholder="fields"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Operator</label>
                            <Select 
                              value={condition.operator}
                              options={operatorOptions} 
                              styles={customSelectStyles}
                              onChange={(selected) => updateCondition(condition.id, 'operator', selected)}
                              placeholder="operators"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Value</label>
                            {dynamicOptions.length > 0 ? (
                              <Select 
                                value={condition.expectedValue}
                                options={dynamicOptions} 
                                styles={customSelectStyles}
                                onChange={(selected) => updateCondition(condition.id, 'expectedValue', selected)}
                                placeholder="values"
                              />
                            ) : (
                              <input 
                                type="text" 
                                value={condition.expectedValue?.value || condition.expectedValue || ''}
                                onChange={(e) => updateCondition(condition.id, 'expectedValue', e.target.value)}
                                className="w-full bg-[#1F2A41] border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 h-[32px] focus:outline-none focus:border-emerald-500 placeholder-slate-500"
                                placeholder="Type text value..."
                              />
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => removeCondition(condition.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 border border-transparent hover:border-slate-700 rounded-md transition mb-[2px]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Actions Block (THEN) */}
            <div className="bg-[#111726] border border-slate-800 border-l-4 border-l-indigo-500 rounded-xl p-6 shadow-xl h-fit">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-indigo-500/10 rounded">
                    <Play className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-200">Actions (THEN)</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Execute these when triggered</p>
                  </div>
                </div>
                <button 
                  onClick={addAction}
                  className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Action
                </button>
              </div>

              <div className="space-y-3">
                {actions.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-4">No actions added yet.</p>
                ) : (
                  actions.map((action) => {
                    const dynamicActionOptions = getDynamicOptions(action.coreField);
                    return (
                      <div key={action.id} className="bg-[#161F30] border border-slate-700/60 rounded-lg p-4 flex flex-col sm:flex-row items-end sm:items-center gap-3">
                        <div className="w-full sm:flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Action Type</label>
                            <Select 
                              value={action.actionType}
                              options={actionTypeOptions} 
                              styles={customSelectStyles}
                              onChange={(selected) => updateAction(action.id, 'actionType', selected)}
                              placeholder="types"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Target Field</label>
                            <Select 
                              value={action.coreField}
                              options={coreFieldOptions} 
                              styles={customSelectStyles}
                              onChange={(selected) => {
                                updateAction(action.id, 'coreField', selected);
                                
                              }}
                              placeholder="fields"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Value</label>
                            {dynamicActionOptions.length > 0 ? (
                              <Select 
                                value={action.targetValue}
                                options={dynamicActionOptions} 
                                styles={customSelectStyles}
                                onChange={(selected) => updateAction(action.id, 'targetValue', selected)}
                                placeholder="values"
                              />
                            ) : (
                              <input 
                                type="text" 
                                value={action.targetValue?.value || action.targetValue || ''}
                                onChange={(e) => updateAction(action.id, 'targetValue', e.target.value)}
                                className="w-full bg-[#1F2A41] border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 h-[32px] focus:outline-none focus:border-indigo-500"
                                placeholder="Type value..."
                              />
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => removeAction(action.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 border border-transparent hover:border-slate-700 rounded-md transition mb-[2px]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

  const customSelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "#1E293B",
    border: "none", 
    boxShadow: "none", 
    minHeight: "30px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#FFFFFF", 
    fontWeight: "bold",
  }),
  menu: (base) => ({
    ...base,
    minWidth: "100px" , 
    backgroundColor: "#1E293B",
    border: "1px solid #334155", 
  }),
  menuList: (base) => ({
    ...base,
    padding: "2px",
    maxHeight: "200px", 
    "::-webkit-scrollbar": {
      width: "0px",
      background: "transparent"
    },
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#2563EB" 
      : state.isFocused
      ? "#374151" 
      : "#1E293B",
    color: "white",
    cursor: "pointer",
  }),
};

export default CreateWorkFlowRules;