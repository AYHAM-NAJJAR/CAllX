import React, { useState } from 'react';
import Button from '../../../components/common/Button';
import Modal from 'react-modal';
import LoadingCircle from '../../../components/common/LoadingCircle';
import { TicketPlus } from 'lucide-react';
import { useActiveFields } from '../../../hooks/useActiveFields';
import { useDepartmentCategories, useDepartments } from '../../../hooks/useDepartments';
import Select from 'react-select';
import { createTicket } from '../../../services/Tickets/CreateTicket';


function CreateTicketModal({ isOpen, onClose }) {
  const token =localStorage.getItem("Token")
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    departmentId: '',
    categoryId: '',
    dynamicAttributes: {} 
  });

  
  const { data: dynamicFields, isLoading: isLoadingFields } = useActiveFields(token);
  const { 
    data: departments = [], 
    isLoading: isDepsLoading, 
  } = useDepartments(token,true);
  const { data: categories = [] } = useDepartmentCategories(token, formData.departmentId,true);


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
  const handleCategoryChange = (selectedOption) =>{
    setFormData(prev => ({
      ...prev,
      categoryId: selectedOption ? selectedOption.value : null 
    }));
  }
  
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

  

const handleCreateTicket = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    
    const dataObject = {
      title: formData.title,
      description: formData.description,
      departmentId: parseInt(formData.departmentId),
      categoryId: parseInt(formData.categoryId),
      dynamicAttributes: formData.dynamicAttributes, 
    };

    const result = await createTicket(dataObject, imageFile, token);
    
    console.log('تم الإرسال بنجاح من خلال السيرفيس:', result);
    
    setFormData({
      title: '',
      description: '',
      departmentId: '',
      categoryId: '',
      dynamicAttributes: {}
    });
    setImageFile(null);
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
        
        {/* Header Section */}
        <div className="border-b border-[#2A2E37] pb-4">
            <div className='flex flex-row items-center gap-4 mb-2 '>
                <TicketPlus size={30} className='text-sky-400' />
                <h2 className="text-2xl font-semibold text-sky-400 ">Create Ticket</h2>
            </div>
             <p className="text-sm text-gray-400 leading-relaxed">
            Create a ticket to communicate with our support team. Provide a clear title, a detailed description, and any relevant details. Your request will be tracked and handled by the appropriate team until it is resolved.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleCreateTicket} className="flex flex-col gap-5">
          
          {/* Title */}
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

          {/* Type, Department, Category (Grid Layout) */}
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
                  value={categories.find(d => d.value === formData.categoryId) || null}
                  options={categories} 
                  styles={customStyles}
                  isLoading={isDepsLoading}
                  onChange={handleCategoryChange}
                  placeholder="Select a department..."
                />
            </div>
          </div>

          {/* Dynamic Fields Section (حقول ديناميكية يتم توليدها بناءً على الـ API) */}
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

                {/* يمكنك هنا لاحقاً توسيع الشروط لرندرة أنواع أخرى مثل DROPDOWN أو NUMBER */}
              </div>
            ))
          )}

          {/* Description */}
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

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">images(select photo define ticket)</label>
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

          {/* Actions (Buttons) */}
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
              {isLoading ? <LoadingCircle size="small" color="#ffffff" /> : 'Submit Ticket'}
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
    minHeight: "30px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#FFFFFF", 
    fontWeight: "bold",
  }),
  menu: (base) => ({
    ...base,
    width: "250px" , 
    backgroundColor: "#1E293B",
    border: "1px solid #334155", 
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