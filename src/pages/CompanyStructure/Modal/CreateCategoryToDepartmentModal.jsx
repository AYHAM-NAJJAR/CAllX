import React, { useState } from 'react';
import Button from '../../../components/common/Button';
import { createCategoryService } from '../../../services/CompanyStructure/addCategoryToDepartment';
import { toast } from 'react-toastify';
import image2 from '../../../assets/image2.png';
import { motion } from 'framer-motion';
import { useDepartments } from '../../../hooks/useDepartments';

import Modal from 'react-modal';
import LoadingInButton from '../../../components/common/LoadingInButton';

const CreateCategoryToDepartmentModal = ({ isOpen, onClose, onSuccess }) => {
  const [activeId, setActiveId] = useState(null); 
  const [categoryName, setCategoryName] = useState('');
  const [validationError, setValidationError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const token = localStorage.getItem('Token');

  const { 
    data: departments = [], 
    isLoading, 
    isError, 
    error: apiError 
  } = useDepartments(token);

  const handleSave = async () => {
    setLoading(true);
    if (!categoryName.trim() || !activeId) {
      setValidationError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await createCategoryService(
        activeId,
        categoryName,
        token
      );

      if (response.success) {
        setCategoryName('');
        setValidationError(false);
        if (onSuccess) onSuccess();
        onClose(false);

        toast.success(response.message, {
          position: 'top-left',
          autoClose: 3000,
          className:
            '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
        });
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response);
      } else {
        console.error("Error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setActiveId(null);
    setValidationError(false);
    setCategoryName('');
    onClose(false);
  };
   
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      ariaHideApp={false}
      className="outline-none max-w-4xl w-full mx-auto"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60 p-4 overflow-y-auto"
    >
      <div className="bg-gray-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-evenly gap-8 border border-gray-800 shadow-2xl">
        
        {/* القسم الأيمن: الصورة والوصف فقط بدون أزرار التنقل */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-xl w-full max-w-sm flex flex-col items-start justify-start"
        >
          <motion.img
            src={image2}
            alt="Department illustration"
            className="w-24 h-24 object-contain"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          />

          <h2 className="text-xl font-bold text-white mt-4">
            Create Category To Department
          </h2>

          <p className="text-sm font-semibold text-[#0D9EF2] mt-2">
            "Please select the department you want to add sub-departments to. You
            can add multiple sub-departments; once you're ready, click Save."
          </p>
        </motion.div>

        {/* القسم الأيسر: قائمة الأقسام وحقل إدخال الفئة */}
        <div className="w-full max-w-sm bg-[#171A21] rounded-xl shadow-xl border border-gray-800 p-6 flex flex-col max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          <p className="text-white text-lg font-medium mb-4">Select a Department:</p>

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-blue-400 animate-pulse">Loading Departments...</p>
            </div>
          ) : isError ? (
            <p className="text-red-400 text-sm text-center py-4">{apiError?.message}</p>
          ) : departments.length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-gray-400 text-lg">No departments found.</p>
            </div>
          ) : (
            <div className="space-y-2 mb-6">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => {
                    setActiveId(dept.id);
                    setValidationError(false);
                  }}
                  className={`w-full py-2 px-3 rounded-lg border text-center transition-colors font-medium text-sm ${
                    activeId === dept.id
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-transparent border-gray-700 text-gray-200 hover:bg-gray-800/50'
                  }`}
                >
                  {dept.name} Department
                </button>
              ))}
            </div>
          )}

          {/* حقل إدخال الفئة وأزرار الحفظ والإلغاء */}
          <div className="border-t border-gray-800 pt-4 space-y-4">
            <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
              Add New Category
            </h4>

            <div>
              <label className="block text-xs text-gray-400 mb-2">
                Category Name
              </label>

              <input
                type="text"
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  setValidationError(false);
                }}
                placeholder="e.g., Strategic Growth"
                className={`w-full bg-[#1f2937] border rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all ${
                  validationError
                    ? 'border-red-400/50 focus:ring-red-500/20'
                    : 'border-gray-700 focus:ring-blue-500/20'
                }`}
              />

              {validationError && (
                <p className="text-red-400 text-[11px] mt-2 flex items-center gap-1">
                  <span className="inline-block w-3 h-3 border border-red-400 rounded-full text-center leading-[10px] text-[10px] font-bold">
                    !
                  </span>
                  {!activeId ? 'Please select a department first' : 'Category name is required'}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2 px-6 rounded-lg transition-colors shadow-lg shadow-blue-900/20 flex-1 justify-center flex items-center"
              >
                {loading ?   <LoadingInButton/> : <p>Save Category</p>}
              </Button>

              <Button
                onClick={handleCloseModal}
                className="bg-transparent border border-gray-700 hover:bg-gray-800 text-gray-300 text-sm font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Cancel
              </Button>
            </div>
          </div>

        </div>

      </div>
    </Modal>
  );
};

export default CreateCategoryToDepartmentModal;