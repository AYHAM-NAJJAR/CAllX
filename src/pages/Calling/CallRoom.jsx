import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Pause, 
  Save, 
  Settings, 
  Bell 
} from 'lucide-react';
import Select from 'react-select';
import { useCall } from '../../context/Call/CallContext';
import { useActiveFields } from '../../hooks/useActiveFields';
import { useDepartmentCategories, useDepartments } from '../../hooks/useDepartments';
import { createTicket } from '../../services/Tickets/CreateTicket';
import LoadingCircle from '../../components/common/LoadingCircle';

const CallRoom = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();

  // Call Context Data
  const { 
    activeCall, 
    incomingCalls, 
    isMuted, 
    handleToggleMute, 
    handleEndOrRejectCall 
  } = useCall();

  // Form States
  const [isLoading, setIsLoading] = useState(false);
  const [priority, setPriority] = useState('MEDIUM');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    departmentId: '',
    categoryId: '',
    dynamicAttributes: {}
  });

  // Custom Hooks Data
  const { data: dynamicFields, isLoading: isLoadingFields } = useActiveFields(token);
  const { data: departments = [], isLoading: isDepsLoading } = useDepartments(token, true);
  const { data: categories = [] } = useDepartmentCategories(token, formData.departmentId, true);

  const callerIdentity = activeCall?.callerIdentity || incomingCalls[0]?.callerIdentity || "JOHN DOE";
  const callerPhone = activeCall?.phone || incomingCalls[0]?.phone || "+1 (555) 0123-4567";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      departmentId: selectedOption ? selectedOption.value : ''
    }));
  };

  const handleCategoryChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      categoryId: selectedOption ? selectedOption.value : ''
    }));
  };

  const handleDynamicFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      dynamicAttributes: {
        ...prev.dynamicAttributes,
        [fieldName]: value,
      }
    }));
  };

  // إنهاء المكالمة والعودة للوحة الرئيسية
  const onHangUp = () => {
    handleEndOrRejectCall();
    navigate('/main');
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataObject = {
        title: formData.title || `Incident from ${callerIdentity}`,
        description: formData.description,
        departmentId: parseInt(formData.departmentId),
        categoryId: parseInt(formData.categoryId),
        priority,
        dynamicAttributes: formData.dynamicAttributes,
      };

      await createTicket(dataObject, null, token);
      alert("Ticket saved successfully!");
    } catch (error) {
      console.error('Error creating ticket:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-200 font-sans p-6">
      <div className="max-w-6xl mx-auto space-y-5">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">CALL ROOM</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full text-xs font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Connected Live
            </span>
            <button className="text-slate-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Call Floating Control Box */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl border-2 border-emerald-500/80 flex items-center justify-center bg-slate-900 overflow-hidden">
                <User className="w-7 h-7 text-emerald-400" />
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#111726] rounded-full" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">{callerIdentity}</h3>
              <p className="text-xs text-emerald-400 font-mono mt-0.5 flex items-center gap-2">
                <span>Active Call</span> • <span className="text-slate-300">{callerPhone}</span>
              </p>
            </div>
          </div>

          {/* Call Controls Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleMute}
              type="button"
              className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl border transition-colors ${
                isMuted 
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {isMuted ? <MicOff className="w-4 h-4 mb-1" /> : <Mic className="w-4 h-4 mb-1" />}
              <span className="text-[9px] font-bold">MUTE</span>
            </button>

            <button type="button" className="flex flex-col items-center justify-center w-16 h-12 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors">
              <Pause className="w-4 h-4 mb-1" />
              <span className="text-[9px] font-bold">HOLD</span>
            </button>

            <button
              onClick={onHangUp}
              type="button"
              className="flex flex-col items-center justify-center w-16 h-12 rounded-xl bg-rose-600/20 border border-rose-600/40 text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
            >
              <PhoneOff className="w-4 h-4 mb-1" />
              <span className="text-[9px] font-bold">HANG UP</span>
            </button>
          </div>
        </div>

        {/* Ticket Creator Form Card */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <h2 className="text-base font-bold text-white tracking-wide">Ticket Creator</h2>
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">NEW INCIDENT</span>
          </div>

          <form onSubmit={handleCreateTicket} className="space-y-5">
            {/* Customer Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
                  CUSTOMER NAME
                </label>
                <input
                  type="text"
                  readOnly
                  value={callerIdentity}
                  className="w-full bg-[#182032] border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
                  PHONE
                </label>
                <input
                  type="text"
                  readOnly
                  value={callerPhone}
                  className="w-full bg-[#182032] border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 outline-none font-mono"
                />
              </div>
            </div>

            {/* Category & Priority Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
                  CATEGORY
                </label>
                <Select
                  value={categories.find(c => c.value === formData.categoryId) || null}
                  options={categories}
                  onChange={handleCategoryChange}
                  styles={customStyles}
                  placeholder="Select category..."
                />
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
                  PRIORITY
                </label>
                <div className="grid grid-cols-3 gap-2 bg-[#182032] p-1 rounded-xl border border-slate-800/80">
                  {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        priority === p
                          ? 'bg-slate-700/80 text-white shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamic Fields (If Any) */}
            {isLoadingFields ? (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <LoadingCircle size="small" color="#38bdf8" />
                <span>Loading dynamic fields...</span>
              </div>
            ) : (
              dynamicFields?.map((field) => (
                <div key={field.fieldName}>
                  <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
                    {field.fieldLabel} {field.isRequired && <span className="text-rose-500">*</span>}
                  </label>
                  {field.fieldType === "TEXT" && (
                    <input
                      type="text"
                      required={field.isRequired}
                      value={formData.dynamicAttributes[field.fieldName] || ''}
                      onChange={(e) => handleDynamicFieldChange(field.fieldName, e.target.value)}
                      placeholder={`Enter ${field.fieldLabel.toLowerCase()}...`}
                      className="w-full bg-[#182032] border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-500/50"
                    />
                  )}
                </div>
              ))
            )}

            {/* Problem Description */}
            <div>
              <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
                PROBLEM DESCRIPTION
              </label>
              <textarea
                rows="3"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter detailed issue notes..."
                className="w-full bg-[#182032] border border-slate-800/80 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-cyan-500/50 resize-y"
              />
            </div>

            {/* Department & Submit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
                  DEPARTMENT
                </label>
                <Select
                  value={departments.find(d => d.value === formData.departmentId) || null}
                  options={departments}
                  onChange={handleDepartmentChange}
                  styles={customStyles}
                  isLoading={isDepsLoading}
                  placeholder="Select department..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-bold text-xs tracking-wider uppercase transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <LoadingCircle size="small" color="#000000" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

// React-Select Custom Styling to match the UI
const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "#182032",
    borderColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: "0.75rem",
    padding: "2px 4px",
    boxShadow: "none",
    "&:hover": { borderColor: "rgba(51, 65, 85, 0.8)" }
  }),
  singleValue: (base) => ({ ...base, color: "#E2E8F0", fontSize: "14px" }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#182032",
    border: "1px solid rgba(51, 65, 85, 0.8)",
    borderRadius: "0.75rem",
    overflow: "hidden"
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#2563EB" : state.isFocused ? "#1E293B" : "#182032",
    color: "#FFFFFF",
    fontSize: "13px",
    cursor: "pointer"
  })
};

export default CallRoom;