import React, { useState } from 'react';
import Button from '../../../components/common/Button';
import Modal from 'react-modal';
import LoadingInButton from '../../../components/common/LoadingInButton';
import LoadingCircle from '../../../components/common/LoadingCircle';
import { TicketPlus } from 'lucide-react';
import { useActiveFields } from '../../../hooks/useActiveFields';
import { useDepartmentCategories, useDepartments } from '../../../hooks/useDepartments';
import { useCustomers } from '../../../hooks/useCustomers';
import Select from 'react-select';
import { createTicket } from '../../../services/Tickets/CreateTicket';
import { toast } from 'react-toastify';

function CreateTicketModal({ isOpen, onClose, onSuccess }) {
  const token = localStorage.getItem("Token");
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [multiFileNames, setMultiFileNames] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    departmentId: '',
    categoryId: '',
    userId: '', 
    dynamicAttributes: {} 
  });

  const { data: dynamicFields, isLoading: isLoadingFields } = useActiveFields(token);
  const { 
    data: departments = [], 
    isLoading: isDepsLoading, 
  } = useDepartments(token, true);
  const { data: categories = [], isLoading: isCatsLoading } = useDepartmentCategories(token, formData.departmentId, true);
  
  const { data: rawCustomers = [], isLoading: isCustomersLoading } = useCustomers(token);

  const customerOptions = rawCustomers.map((c) => ({
    value: c.id || c.userId,
    label: `${c.fullName || c.name || 'Customer'} (${c.email || c.phone || c.id})`
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      departmentId: selectedOption ? selectedOption.value : null
    }));
  };

  const handleCategoryChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      categoryId: selectedOption ? selectedOption.value : null 
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

  // دالة مساعدة لمعالجة الخيارات بأمان سواء كانت مصفوفة أو نص
  const getFieldOptions = (options) => {
    if (!options) return [];
    if (Array.isArray(options)) return options;
    if (typeof options === 'string') {
      try {
        const parsed = JSON.parse(options);
        // إذا كان الكائن يحتوي على مفتاح values وهو عبارة عن مصفوفة
        if (parsed && Array.isArray(parsed.values)) {
          return parsed.values;
        }
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return options.split(',').map(opt => opt.trim());
      }
    }
    return [];
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
        userId: formData.userId ? parseInt(formData.userId) : null, 
        dynamicAttributes: formData.dynamicAttributes, 
      };
      
      const result = await createTicket(dataObject, imageFile, token);
      
      toast.success("Ticket created successfully!", {
        position: "top-left",
        autoClose: 3000,
        className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
      });
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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="outline-none"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-4"
    >
      <div className="bg-[#171A21] rounded-2xl border border-[#2A2E37] p-6 w-full max-w-2xl flex flex-col gap-6 shadow-2xl max-h-[90vh] overflow-auto custom-scrollbar text-gray-200">
        
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
              className="bg-[#1C2029] border border-[#2A2E37] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none transition-all placeholder-gray-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="userId" className="text-sm font-medium text-gray-300">User / Customer</label>
            <Select
              value={customerOptions.find(c => c.value === formData.userId) || null}
              options={customerOptions}
              styles={customStyles}
              isLoading={isCustomersLoading}
              onChange={handleUserChange}
              placeholder="Select a customer..."
              isClearable
            />
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

                {/* 3. DATE */}
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

                {/* 4. SELECT (تم تحديثه لحل الخطأ) */}
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
                    className="bg-[#1C2029] border border-[#2A2E37] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 outline-none transition-all 
                               file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer text-gray-400"
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
          // حفظ أسماء الملفات لعرضها للمستخدم
          setMultiFileNames(prev => ({
            ...prev,
            [field.fieldName]: files.map(f => f.name)
          }));

          // تحويل جميع الملفات إلى Base64
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
      className="bg-[#1C2029] border border-[#2A2E37] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 outline-none transition-all 
                 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer text-gray-400"
    />
    
    {/* عرض أسماء الملفات المختارة بوضوح تحت الزر */}
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
            <Button 
              type="button" 
              onClick={onClose} 
              className="bg-transparent border border-[#2A2E37] hover:bg-[#2A2E37] text-white px-5 py-2 rounded-lg transition-colors"
            >
              Cancel
            </Button>
            
            <Button 
              type="submit" 
              disabled={isLoading || isLoadingFields}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center min-w-[100px]"
            >
              {isLoading ? <LoadingInButton size="small" color="#ffffff" /> : 'Submit Ticket'}
            </Button>
          </div>
          
        </form>
      </div>
    </Modal>
  );
}

const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "#1E293B",
    border: "none", 
    boxShadow: "none", 
    minHeight: "42px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#FFFFFF", 
    fontWeight: "bold",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#1E293B",
    border: "1px solid #334155", 
    zIndex: 9999,
  }),
  menuList: (base) => ({
    ...base,
    padding: "4px",
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

export default CreateTicketModal;