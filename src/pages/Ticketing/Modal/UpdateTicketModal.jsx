import React, { useEffect, useState } from 'react';
import Button from '../../../components/common/Button';
import Modal from 'react-modal';
import LoadingCircle from '../../../components/common/LoadingCircle';
import { Edit3 } from 'lucide-react'; 
import { useActiveFields } from '../../../hooks/useActiveFields';
import { useDepartmentCategories, useDepartments } from '../../../hooks/useDepartments';
import Select from 'react-select';
import { useEmployees } from '../../../hooks/useEmployees';
import { updateTicket } from '../../../services/Tickets/updateTicket';
import { toast } from 'react-toastify';
import LoadingInButton from '../../../components/common/LoadingInButton';
// import { updateTicket } from '../../../services/Tickets/UpdateTicket'; 

function UpdateTicketModal({ data, isOpen, onClose }) {
  const token = localStorage.getItem("Token");
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: data?.title || '',
    description: data?.description || '',
    departmentId: data?.departmentId || '', // نستخدم المعرّف (ID) بشكل موحد
    categoryId: data?.categoryId || '',     // نستخدم المعرّف (ID) بشكل موحد
    status: data?.status || 'OPEN',
    priority: data?.priority || 'LOW',
    assignedToId: data?.assignedToId || '',
    adminNotes: data?.adminNotes || '',
    dynamicAttributes: data?.dynamicAttributes || {} 
  });

  // مزامنة الحقول عند تغير التذكرة الممررة
  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || '',
        description: data.description || '',
        departmentId: data.departmentId || '', 
        categoryId: data.categoryId || '',     
        status: data.status || 'OPEN',
        priority: data.priority || 'LOW',
        assignedToId: data.assignedToId || '',
        adminNotes: data.adminNotes || '',
        dynamicAttributes: data.dynamicAttributes || {}
      });
    }
  }, [data, isOpen]);

  const { data: dynamicFields, isLoading: isLoadingFields } = useActiveFields(token);
  const { data: departments = [], isLoading: isDepsLoading } = useDepartments(token, true);
  const { data: categories = [], isLoading: isCatsLoading } = useDepartmentCategories(token, formData.departmentId, true);
  const { data: employees = [] } = useEmployees(token, true);

  const statusOptions = [
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'CLOSED', label: 'Closed' }
  ];

  const priorityOptions = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'CRITICAL', label: 'Critical' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDynamicFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      dynamicAttributes: { ...prev.dynamicAttributes, [fieldName]: value }
    }));
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const dataObject = {
        title: formData.title,
        description: formData.description,
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        status: formData.status,
        priority: formData.priority,
        assignedToId: formData.assignedToId ? parseInt(formData.assignedToId) : null,
        adminNotes: formData.adminNotes,
        dynamicAttributes: formData.dynamicAttributes, 
      };
      
      console.log("Submitting Data:", dataObject);
      const result = await updateTicket(data.id, dataObject, token);
      if (result.success) {
        toast.success(result.message, {
                position: "top-left",
                autoClose: 3000,
                className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
        });
              onClose(true); 
      }
      
    } catch (error) {
      console.error('حدث خطأ أثناء تحديث التذكرة:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onClose(false)}
      className="outline-none"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-4"
    >
      <div className="bg-[#171A21] rounded-2xl border border-[#2A2E37] p-6 w-full max-w-2xl flex flex-col gap-6 shadow-2xl max-h-[90vh] overflow-auto custom-scrollbar text-gray-200">
        
        {/* Header Section */}
        <div className="border-b border-[#2A2E37] pb-4">
          <div className='flex flex-row items-center gap-4 mb-2'>
            <Edit3 size={30} className='text-sky-400' />
            <h2 className="text-2xl font-semibold text-sky-400">Edit Ticket #{data?.ticketId || data?.id}</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Modify the ticket attributes below. Updating fields will change the context for the assigned support agents.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleUpdateTicket} className="flex flex-col gap-5">
          
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
              className="bg-[#1C2029] border border-[#2A2E37] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none transition-all"
            />
          </div>

          {/* Department & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Department Select */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Department</label>
              <Select
                // هنا نقوم بالبحث داخل المصفوفة لإيجاد العنصر الذي يطابق الـ id الحالي وعرضه
                value={departments.find(d => d.value === formData.departmentId) || null}
                options={departments} 
                styles={customStyles}
                isLoading={isDepsLoading}
                onChange={(opt) => setFormData(p => ({ ...p, departmentId: opt ? opt.value : '', categoryId: '' }))} 
                placeholder="Select department..."
              />
              <p className='bg-slate-700/50 rounded-full p-1 text-xs text-center text-gray-300 border border-slate-600 mt-1'>
                Current Department: {data?.department || "None"}
              </p>
            </div>

            {/* Category Select */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Category</label>
              <Select
                // هنا نجد الصنف بناءً على الـ categoryId المختار
                value={categories.find(c => c.value === formData.categoryId) || null}
                options={categories} 
                styles={customStyles}
                isLoading={isCatsLoading}
                disabled={!formData.departmentId} // تعطيل الاختيار إذا لم يتم تحديد قسم بعد
                onChange={(opt) => setFormData(p => ({ ...p, categoryId: opt ? opt.value : '' }))}
                placeholder="Select category..."
              />
              <p className='bg-slate-700/50 rounded-full p-1 text-xs text-center text-gray-300 border border-slate-600 mt-1'>
                Current Category: {data?.categoryName || "None"}
              </p>
            </div>
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Status</label>
              <Select
                value={statusOptions.find(s => s.value === formData.status) || null}
                options={statusOptions}
                styles={customStyles}
                onChange={(opt) => setFormData(p => ({ ...p, status: opt ? opt.value : 'OPEN' }))}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Priority</label>
              <Select
                value={priorityOptions.find(p => p.value === formData.priority) || null}
                options={priorityOptions}
                styles={customStyles}
                onChange={(opt) => setFormData(p => ({ ...p, priority: opt ? opt.value : 'LOW' }))}
              />
            </div>
          </div>

          {/* Assigned Agent ID */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Assigned Agent</label>
              <Select
                // قمنا بإصلاح الـ value والـ onChange لتعمل مع الـ assignedToId بشكل صحيح
                value={employees.find(e => e.value === formData.assignedToId) || null}
                options={employees} 
                styles={customStyles}
                onChange={(opt) => setFormData(p => ({ ...p, assignedToId: opt ? opt.value : '' }))}
                placeholder="Select agent ..."
              />
            </div>
          </div>

          {/* Dynamic Fields Section */}
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
                    className="bg-[#1C2029] border border-[#2A2E37] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none transition-all"
                  />
                )}
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
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="bg-[#1C2029] border border-[#2A2E37] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none transition-all resize-y"
            ></textarea>
          </div>

          {/* Admin Notes */}
          <div className="flex flex-col gap-2">
            <label htmlFor="adminNotes" className="text-sm font-medium text-gray-300">Admin Notes</label>
            <textarea
              id="adminNotes"
              name="adminNotes"
              rows="2"
              value={formData.adminNotes}
              onChange={handleChange}
              placeholder="Internal notes visible only to staff..."
              className="bg-[#1C2029] border border-[#2A2E37] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none transition-all resize-y"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-2 border-t border-[#2A2E37] pt-5">
            <Button 
              type="button" 
              onClick={() => onClose(false)} 
              className="bg-transparent border border-[#2A2E37] hover:bg-[#2A2E37] text-white px-5 py-2 rounded-lg transition-colors"
            >
              Cancel
            </Button>
            
            <Button 
              type="submit" 
              disabled={isLoading || isLoadingFields}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center min-w-[120px]"
            >
              {isLoading ? <LoadingInButton /> : 'Save Changes'}
            </Button>
          </div>
          
        </form>
      </div>
    </Modal>
  );
}

// الستايل الخاص بالـ React Select
const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "#1C2029",
    border: "1px solid #2A2E37", 
    boxShadow: "none", 
    borderRadius: "0.5rem",
    padding: "2px",
    minHeight: "42px",
    "&:hover": {
      borderColor: "#3b82f6"
    }
  }),
  singleValue: (base) => ({
    ...base,
    color: "#FFFFFF", 
  }),
  placeholder: (base) => ({
    ...base,
    color: "#6b7280",
    fontSize: "0.875rem"
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#171A21",
    border: "1px solid #2A2E37", 
    borderRadius: "0.5rem",
    zIndex: 99
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#2563EB" 
      : state.isFocused
      ? "#2A2E37" 
      : "transparent",
    color: "white",
    cursor: "pointer",
    fontSize: "0.875rem"
  }),
};

export default UpdateTicketModal;