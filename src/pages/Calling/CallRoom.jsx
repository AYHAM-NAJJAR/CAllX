import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Pause, 
  Settings, 
  Bell,
  Smile,
  HelpCircle,
  MessageSquare,
  FileEdit,
  TicketPlus,
  PhoneCall,
  ListStart,
  UserCheck
} from 'lucide-react';
import Select from 'react-select';
import { useCall } from '../../context/Call/CallContext';
import { useActiveFields } from '../../hooks/useActiveFields';
import { useDepartmentCategories, useDepartments } from '../../hooks/useDepartments';


import ModalWrapUp from './ModalWrapUp';
import CallChecklist from './components/CallChecklist';
import { createTicket } from '../../services/Tickets/CreateTicket';
import LoadingInButton from '../../components/common/LoadingInButton';
import LoadingCircle from '../../components/common/LoadingCircle';
import TransferToQueueModal from './Modal/TransferToQueueModal';
import TransferToAgentModal from './Modal/TransferToAgentModal';

const CallRoom = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const location = useLocation();

  const navigationState = location.state || {};
  const { customerEmail, customerUserId, customerPhone, customerTenantId, callId } = navigationState;

  // تنظيف وتبسيط المتغيرات لتعتمد مباشرة على الـ state الممررة مع قيم افتراضية آمنة
  const displayPhone = customerPhone || "No Phone Found";
  const displayEmail = customerEmail || "No Email Found";
  const displayUserId = customerUserId ? `${customerUserId}` : `No User ID Found`;
  const tenantIdVal = customerTenantId || "No Tenant Found";
  console.log("Call ID:", callId);
  // Call Context Data
  const { 
    isMuted, 
    handleToggleMute, 
    handleEndOrRejectCall,
    callStatus
  } = useCall();
  console.log(callStatus, "Current Call Status💀");
  // أضف هذا الـ useEffect في مكان مناسب داخل المكون (مثلاً مع باقي الـ useEffects)
  useEffect(() => {
    if (callStatus === "ENDED") {
      onHangUp();
    }
  }, [callStatus]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWrapUpModalOpen, setIsWrapUpModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [multiFileNames, setMultiFileNames] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    departmentId: '',
    categoryId: '',
    userId: 102, 
    dynamicAttributes: {}
  });
  const[listQueue,setListQueue]=useState(false)
  const[listAgent,setListAgent]=useState(false)
  // Call Checklist State
  const [checklist, setChecklist] = useState([
    { id: 1, title: 'Welcome & Platform Intro', desc: 'Greet customer and state platform name', completed: false, icon: Smile },
    { id: 2, title: 'Inquire Call Reason', desc: 'Ask how you can assist the customer today', completed: false, icon: HelpCircle },
    { id: 3, title: 'Active Listening', desc: 'Allow customer sufficient space to explain', completed: false, icon: MessageSquare },
    { id: 4, title: 'Record Ticket', desc: 'Fill in details in the Ticket Creator form', completed: false, icon: FileEdit }
  ]);

  const toggleChecklistItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Custom Hooks Data (تم افتراض وجود useCustomers أو استخدام مصفوفة فارغة لتجنب الـ Undefined)
  const { data: dynamicFields, isLoading: isLoadingFields } = useActiveFields(token);
  const { data: departments = [], isLoading: isDepsLoading } = useDepartments(token, true);
  const { data: categories = [], isLoading: isCatsLoading } = useDepartmentCategories(token, formData.departmentId, true);
  
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      departmentId: selectedOption ? selectedOption.value : '',
      categoryId: '' // إعادة تعيين الفئة عند تغيير القسم
    }));
  };

  const handleCategoryChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      categoryId: selectedOption ? selectedOption.value : ''
    }));
  };

  const handleUserChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      userId: selectedOption ? selectedOption.value : null
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

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const onHangUp = () => {
    handleEndOrRejectCall();
    navigate("/main");
  };

  const onClose = () => {
    setFormData({
      title: '',
      description: '',
      departmentId: '',
      categoryId: '',
      userId: '',
      dynamicAttributes: {}
    });
    setImageFile(null);
  };

  const onSuccess = async () => {
    // منطق النجاح الإضافي إذا وجد
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataObject = {
        title: formData.title,
        description: formData.description,
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        userId: displayUserId,
        dynamicAttributes: formData.dynamicAttributes,
      };
      
      await createTicket(dataObject, imageFile, token);
        
        toast.success("Create Ticket During Call Done", {
          position: "top-left",
          autoClose: 3000,
          className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
        });
        
        setFormData({ name: '', tenantId: '' });
      setFormData({
        title: '',
        description: '',
        departmentId: '',
        categoryId: '',
        userId: '',
        dynamicAttributes: {}
      });
      setImageFile(null);
      await onSuccess();
      onClose();
      
    } catch (error) {
      console.error('حدث خطأ أثناء إرسال التذكرة بالواجهة:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // دالة مساعدة لخيارات الحقول الديناميكية
  const getFieldOptions = (options) => {
    if (!options) return [];
    if (Array.isArray(options)) return options;
    return [];
  };
  function onQueueClick(params) {
    
    setListQueue(true)

  }
  function onAgentClick(params) {
    
    setListAgent(true)

  }
  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-200 font-sans p-6">
      <ModalWrapUp isOpen={isWrapUpModalOpen} setIsOpen={setIsWrapUpModalOpen} />
      <TransferToQueueModal 
       isOpen={listQueue} 
       onClose={() => setListQueue(false)} 
    />
      <TransferToAgentModal
      callId={callId} 
       isOpen={listAgent} 
       onClose={() => setListAgent(false)} 
    />
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">CALL ROOM</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3">
              {/* زر تحويل إلى الطابور */}
              <button 
                onClick={onQueueClick}
                className=" p-2  rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold transition-all shadow-md shadow-emerald-900/30 border border-emerald-500/30"
              >
                <ListStart className="w-5 h-5 " />
                {/* <span className="text-[11px] tracking-wider uppercase">Forward To Queue</span> */}
              </button>

              {/* زر تحويل إلى موظف */}
              <button 
                onClick={onAgentClick}
                className="p-2 rounded-full bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-semibold transition-all shadow-md shadow-sky-900/30 border border-sky-500/30"
              >
                <UserCheck className="w-5 h-5 " />
                {/* <span className="text-[11px] tracking-wider uppercase">Forward To Agent</span> */}
              </button>
            </div>
            <span className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full text-xs font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Connected Live
            </span>
            
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
              <h3 className="text-lg font-bold text-white tracking-wide">{displayUserId}</h3>
              <p className="text-xs text-emerald-400 font-mono mt-0.5 flex items-center gap-2">
                <span>Active Call</span> • <span className="text-slate-300">{displayPhone}</span>
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

        {/* Side-by-Side Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Ticket Creator Form Card */}
          <div className="lg:col-span-2 bg-[#111726] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
                  phone
                </label>
                <p className="w-full bg-[#182032] cursor-not-allowed border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 outline-none font-mono">
                  {displayPhone}
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
                  email
                </label>
                <p className="w-full bg-[#182032] cursor-not-allowed border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 outline-none font-mono">
                  {displayEmail}
                </p>
              </div>
            </div>


            <div className=" rounded-2xl border border-[#2A2E37] p-6 w-full flex flex-col gap-6 shadow-2xl max-h-[90vh] overflow-auto custom-scrollbar text-gray-200">
              
              <div className="border-b border-[#2A2E37] pb-4">
                <div className='flex flex-row items-center gap-4 mb-2'>
                  <TicketPlus size={30} className='text-sky-400' />
                  <h2 className="text-2xl font-semibold text-sky-400">Create Ticket</h2>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Create a ticket to communicate with our support team. Provide a clear title, a detailed description, and any relevant details.
                </p>
              </div>

              <form onSubmit={handleCreateTicket} className="flex flex-col gap-5">
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="title" className="text-sm font-medium text-gray-300">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Cannot access my account"
                    className="bg-primary border border-[#2A2E37] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none transition-all placeholder-gray-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="userId" className="text-sm font-medium text-gray-300">User / Customer</label>
                  <p
                  className="bg-primary border cursor-not-allowed border-[#2A2E37] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none transition-all placeholder-gray-500"
                  >Customer ID : {displayUserId}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="departmentId" className="text-sm font-medium text-gray-300">Department</label>
                    <Select
                      value={departments.find(d => d.value === formData.departmentId) || null}
                      options={departments} 
                      styles={customStyles}
                      isLoading={isDepsLoading}
                      onChange={handleDepartmentChange}
                      placeholder="Select a department..."
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="categoryId" className="text-sm font-medium text-gray-300">Category</label>
                    <Select
                      value={categories.find(c => c.value === formData.categoryId) || null}
                      options={categories} 
                      styles={customStyles}
                      isLoading={isCatsLoading}
                      onChange={handleCategoryChange}
                      placeholder="Select a category..."
                      isDisabled={!formData.departmentId}
                    />
                  </div>
                </div>

                {isLoadingFields ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <LoadingCircle size="small" color="#38bdf8" />
                    <span>Loading dynamic fields...</span>
                  </div>
                ) : (
                  dynamicFields?.map((field) => (
                    <div key={field.fieldName} className="flex flex-col gap-2">
                      <label htmlFor={field.fieldName} className="text-sm font-medium text-gray-300">
                        {field.fieldLabel} {field.isRequired && <span className="text-red-500">*</span>}
                      </label>
                      
                      {field.fieldType === "TEXT" && (
                        <input
                          type="text"
                          id={field.fieldName}
                          name={field.fieldName}
                          required={field.isRequired}
                          value={formData.dynamicAttributes[field.fieldName] || ''}
                          onChange={(e) => handleDynamicFieldChange(field.fieldName, e.target.value)}
                          placeholder={`Enter ${field.fieldLabel.toLowerCase()}...`}
                          className="bg-[#1C2029] border border-[#2A2E37] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none transition-all placeholder-gray-500"
                        />
                      )}

                      {field.fieldType === "NUMBER" && (
                        <input
                          type="number"
                          id={field.fieldName}
                          name={field.fieldName}
                          required={field.isRequired}
                          value={formData.dynamicAttributes[field.fieldName] || ''}
                          onChange={(e) => handleDynamicFieldChange(field.fieldName, e.target.value)}
                          placeholder={`Enter ${field.fieldLabel.toLowerCase()}...`}
                          className="bg-[#1C2029] border border-[#2A2E37] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none transition-all placeholder-gray-500"
                        />
                      )}

                      {field.fieldType?.toUpperCase() === "DATE" && (
                        <input
                          type="date"
                          id={field.fieldName}
                          name={field.fieldName}
                          required={field.isRequired}
                          value={formData.dynamicAttributes[field.fieldName] || ''}
                          onChange={(e) => handleDynamicFieldChange(field.fieldName, e.target.value)}
                          className="bg-[#1C2029] border border-[#2A2E37] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none transition-all placeholder-gray-500"
                        />
                      )}

                      {field.fieldType === "SELECT" && (
                        <select
                          id={field.fieldName}
                          name={field.fieldName}
                          required={field.isRequired}
                          value={formData.dynamicAttributes[field.fieldName] || ''}
                          onChange={(e) => handleDynamicFieldChange(field.fieldName, e.target.value)}
                          className="bg-[#1C2029] border border-[#2A2E37] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none transition-all"
                        >
                          <option value="" disabled>Select {field.fieldLabel}</option>
                          {getFieldOptions(field.options).map((opt, idx) => {
                            const val = opt?.value ?? opt;
                            const label = opt?.label ?? opt;
                            return (
                              <option key={idx} value={val}>
                                {label}
                              </option>
                            );
                          })}
                        </select>
                      )}

                      {(field.fieldType === "USER_REFERENCE" || field.fieldType === "ENTITY_REFERENCE") && (
                        <input
                          type="text"
                          id={field.fieldName}
                          name={field.fieldName}
                          required={field.isRequired}
                          value={formData.dynamicAttributes[field.fieldName] || ''}
                          onChange={(e) => handleDynamicFieldChange(field.fieldName, e.target.value)}
                          placeholder={`Enter ${field.fieldLabel} ID...`}
                          className="bg-[#1C2029] border border-[#2A2E37] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none transition-all placeholder-gray-500"
                        />
                      )}

                      {field.fieldType === "FILE" && (
                        <input
                          type="file"
                          id={field.fieldName}
                          name={field.fieldName}
                          required={field.isRequired}
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                handleDynamicFieldChange(field.fieldName, reader.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="bg-[#1C2029] border border-[#2A2E37] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer text-gray-400"
                        />
                      )}

                      {field.fieldType === "MULTI_FILE" && (
                        <div className="flex flex-col gap-2">
                          <input
                            type="file"
                            multiple
                            id={field.fieldName}
                            name={field.fieldName}
                            required={field.isRequired}
                            onChange={async (e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length > 0) {
                                setMultiFileNames(prev => ({
                                  ...prev,
                                  [field.fieldName]: files.map(f => f.name)
                                }));

                                const base64Promises = files.map(file => {
                                  return new Promise((resolve) => {
                                    const reader = new FileReader();
                                    reader.onloadend = () => resolve(reader.result);
                                    reader.readAsDataURL(file);
                                  });
                                });
                                const base64Files = await Promise.all(base64Promises);
                                handleDynamicFieldChange(field.fieldName, base64Files);
                              }
                            }}
                            className="bg-[#1C2029] border border-[#2A2E37] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer text-gray-400"
                          />
                          {multiFileNames[field.fieldName] && multiFileNames[field.fieldName].length > 0 && (
                            <div className="text-xs text-green-400 font-medium flex flex-col gap-1">
                              <span>Selected files ({multiFileNames[field.fieldName].length}):</span>
                              <span className="text-gray-300">
                                {multiFileNames[field.fieldName].join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}

                <div className="flex flex-col gap-2">
                  <label htmlFor="description" className="text-sm font-medium text-gray-300">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Please provide detailed information about your issue..."
                    className="bg-[#1C2029] border border-[#2A2E37] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none transition-all placeholder-gray-500 resize-y"
                  ></textarea>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">Images (select photo to attach)</label>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#2A2E37] border-dashed rounded-lg cursor-pointer bg-[#1C2029] hover:bg-[#232833] transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        {imageFile && (
                          <p className="text-xs text-green-400 font-medium mt-1">Selected: {imageFile.name}</p>
                        )}
                      </div>
                      <input id="images" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4 border-t border-[#2A2E37] pt-5">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="bg-transparent border border-[#2A2E37] hover:bg-[#2A2E37] text-white px-5 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  
                  <button 
                    type="submit" 
                    disabled={isLoading || isLoadingFields}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center min-w-[100px] cursor-pointer"
                  >
                    {isLoading ? <LoadingInButton size="small" color="#ffffff" /> : 'Submit Ticket'}
                  </button>
                </div>
                
              </form>
            </div>
          </div>

          {/* Call Checklist Component */}
          <CallChecklist 
            checklist={checklist} 
            onToggleItem={toggleChecklistItem} 
          />

        </div>

      </div>
    </div>
  );
};

// React-Select Custom Styling
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