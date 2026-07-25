import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Select from 'react-select'; 
import { Info, SlidersHorizontal, Play, Trash2, Plus } from 'lucide-react';

// Enums and Hooks imports
import { CoreField, Operator, TicketPriority, WorkflowActionType, TicketStatus } from '../../../constants/workflowEnums';
import { useDepartments } from '../../../hooks/useDepartments';
import { useEmployees } from '../../../hooks/useEmployees';
import { getRuleById } from '../../../services/workflowEngine/getOneRule';
import { updateRule } from '../../../services/workflowEngine/updaterule';
import LoadingInButton from '../../../components/common/LoadingInButton';


const WorkFlowUpdateModal = ({ isOpen, onClose, ruleId, token, onSaveSuccess, title = "Update Rule" }) => {
  // Core Fields
  const [ruleName, setRuleName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState({ value: '2', label: 'Priority 2 (Normal)' });
  const [isActive, setIsActive] = useState(true);

  // Conditions and Actions
  const [conditions, setConditions] = useState([]);
  const [actions, setActions] = useState([]);
  
  // Loading and Error States
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Dropdown Data
  const { data: departments = [] } = useDepartments(token, true);
  const { data: employees = [] } = useEmployees(token, true);

  // Dropdown Options
  const priorityTierOptions = [
    { value: '1', label: 'Priority 1 (Low)' },
    { value: '2', label: 'Priority 2 (Normal)' },
    { value: '3', label: 'Priority 3 (Medium)' },
    { value: '4', label: 'Priority 4 (High)' },
    { value: '5', label: 'Priority 5 (Critical)' },
  ];

  const coreFieldOptions = Object.values(CoreField).map(field => ({
    value: field,
    label: field.replace(/_/g, ' ') 
  }));

  const operatorOptions = Object.values(Operator).map(op => ({
    value: op,
    label: op.replace(/_/g, ' ') 
  }));

  const actionTypeOptions = Object.values(WorkflowActionType).map(at => ({
    value: at,
    label: at.replace(/_/g, ' ')
  }));

  // Dynamic Options
  const getDynamicOptions = (selectedField) => {
    if (!selectedField) return [];
    const fieldValue = selectedField.value || selectedField;

    switch (fieldValue) {
      case CoreField.PRIORITY:
        return Object.values(TicketPriority).map(p => ({ value: p, label: p }));
      case CoreField.STATUS:
        return Object.values(TicketStatus).map(s => ({ value: s, label: s.replace(/_/g, ' ') }));
      case CoreField.DEPARTMENT:
        return departments;
      case CoreField.CURRENT_OWNER:
        return employees;
      default:
        return []; 
    }
  };

  // Helper to map API values to react-select options
  const mapValueToOption = (field, value, type = "condition") => {
    if (!value) return "";
    const options = getDynamicOptions(field);
    
    if (options.length > 0) {
      const matched = options.find(opt => String(opt.value) === String(value) || String(opt.id) === String(value));
      return matched ? { value: matched.value || matched.id, label: matched.label || matched.name } : { value: value, label: String(value) };
    }
    return value; 
  };

  // Fetch Data on Mount
  useEffect(() => {
    const fetchRuleDetails = async () => {
      if (!isOpen || !ruleId || !token) return;

      setLoading(true);
      setError(null);
      try {
        const data = await getRuleById(token, ruleId);
        const ruleData = data;
        console.log(ruleData);
        // 1. Fill Core Fields
        setRuleName(ruleData.name || '');
        setDescription(ruleData.description || '');
        setIsActive(ruleData.active ?? true);
        
        const currentPriority = priorityTierOptions.find(p => String(p.value) === String(ruleData.priority));
        if (currentPriority) setPriority(currentPriority);

        // 2. Fill Conditions
        if (ruleData.conditions) {
          const mappedConditions = ruleData.conditions.map(cond => ({
            id: cond.id || Date.now() + Math.random(),
            fieldDefinitionId: cond.fieldDefinitionId,
            coreField: cond.coreField ? { value: cond.coreField, label: cond.coreField.replace(/_/g, ' ') } : null,
            operator: cond.operator ? { value: cond.operator, label: cond.operator.replace(/_/g, ' ') } : null,
            expectedValue: mapValueToOption(cond.coreField, cond.expectedValue)
          }));
          setConditions(mappedConditions);
        }

        // 3. Fill Actions
        if (ruleData.actions) {
          const mappedActions = ruleData.actions.map(act => ({
            id: act.id || Date.now() + Math.random(),
            actionType: act.actionType ? { value: act.actionType, label: act.actionType.replace(/_/g, ' ') } : null,
            fieldDefinitionId: act.fieldDefinitionId,
            coreField: act.coreField ? { value: act.coreField, label: act.coreField.replace(/_/g, ' ') } : null,
            targetValue: mapValueToOption(act.coreField, act.targetValue)
          }));
          setActions(mappedActions);
        }

      } catch (err) {
        console.error("Failed to fetch rule details:", err);
        setError("Unable to load data, please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRuleDetails();
  }, [isOpen, ruleId, token]);

  // --- Conditions Management ---
  const addCondition = () => {
    setConditions([...conditions, { id: Date.now(), fieldDefinitionId: null, coreField: null, operator: null, expectedValue: null }]);
  };
  const removeCondition = (id) => setConditions(conditions.filter(c => c.id !== id));
  const updateCondition = (id, key, selectedOption) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, [key]: selectedOption, ...(key === 'coreField' && { expectedValue: null }) } : c));
  };

  // --- Actions Management ---
  const addAction = () => {
    setActions([...actions, { id: Date.now(), actionType: null, fieldDefinitionId: null, coreField: null, targetValue: null }]);
  };
  const removeAction = (id) => setActions(actions.filter(a => a.id !== id));
  const updateAction = (id, key, selectedOption) => {
    setActions(actions.map(a => a.id === id ? { ...a, [key]: selectedOption, ...(key === 'coreField' && { targetValue: null }) } : a));
  };

  // --- Save Handler ---
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    const formattedConditions = conditions.map((cond, index) => ({
      id: typeof cond.id === 'string' ? undefined : cond.id, 
      fieldDefinitionId: cond.fieldDefinitionId,
      coreField: cond.coreField?.value || null,
      operator: cond.operator?.value || null,
      expectedValue: cond.expectedValue?.value || cond.expectedValue || "", 
      displayOrder: index + 1
    }));

    const formattedActions = actions.map((act, index) => ({
      id: typeof act.id === 'string' ? undefined : act.id, 
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
      active: isActive,
      conditions: formattedConditions,
      actions: formattedActions
    };

    // Integrated update logic
    try {
      const response = await updateRule(ruleId, requestPayload, token);

      if (response.success) {
        if (onSaveSuccess) {
          await onSaveSuccess();
        }
        onClose();
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error("Error saving updates:", err);
      setError("An error occurred while saving the data.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="outline-none w-full max-w-5xl bg-primary text-slate-100 rounded-xl shadow-2xl relative transition-all max-h-[95vh] overflow-y-auto flex flex-col"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="bg-[#0F172A] min-h-full rounded-xl flex flex-col overflow-auto custom-scrollbar">
        {/* Header Section */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-slate-800 bg-[#0F172A]/95 backdrop-blur rounded-t-xl">
          <div>
            <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            <p className="text-sm text-slate-400 mt-1">Modify conditions and actions for this rule.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl font-bold leading-none p-2">
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 text-sm">Loading rule details...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}
              
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
                    <button onClick={addCondition} type="button" className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition">
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
                                  onChange={(selected) => updateCondition(condition.id, 'coreField', selected)}
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
                            <button onClick={() => removeCondition(condition.id)} type="button" className="p-1.5 text-slate-400 hover:text-rose-400 border border-transparent hover:border-slate-700 rounded-md transition mb-[2px]">
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
                    <button onClick={addAction} type="button" className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition">
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
                                  onChange={(selected) => updateAction(action.id, 'coreField', selected)}
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
                            <button onClick={() => removeAction(action.id)} type="button" className="p-1.5 text-slate-400 hover:text-rose-400 border border-transparent hover:border-slate-700 rounded-md transition mb-[2px]">
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
          )}
        </div>

        {/* Footer (Action Buttons) */}
        <div className="sticky bottom-0 z-10 p-4 border-t border-slate-800 bg-[#0F172A]/95 backdrop-blur flex justify-end gap-3 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-medium text-slate-300 bg-transparent border border-slate-700 rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || saving}
            className="px-5 py-2.5 text-sm font-bold text-slate-900 bg-indigo-400 hover:bg-indigo-300 rounded-lg transition-all shadow-lg active:scale-95 disabled:opacity-50 min-w-[120px] flex justify-center items-center"
          >
            {saving ? (
              <LoadingInButton />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Custom Select Styles
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
    fontWeight: "500",
    fontSize: "12px"
  }),
  placeholder: (base) => ({
    ...base,
    color: "#64748B",
    fontSize: "12px"
  }),
  menu: (base) => ({
    ...base,
    minWidth: "100px", 
    backgroundColor: "#1E293B",
    border: "1px solid #334155", 
    zIndex: 9999
  }),
  menuList: (base) => ({
    ...base,
    padding: "2px",
    maxHeight: "200px", 
    "::-webkit-scrollbar": {
      width: "4px",
    },
    "::-webkit-scrollbar-thumb": {
      backgroundColor: "#475569",
      borderRadius: "4px"
    },
    scrollbarWidth: "thin",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#3b82f6" 
      : state.isFocused
      ? "#334155" 
      : "#1E293B",
    color: "white",
    cursor: "pointer",
    fontSize: "12px"
  }),
};

export default WorkFlowUpdateModal;