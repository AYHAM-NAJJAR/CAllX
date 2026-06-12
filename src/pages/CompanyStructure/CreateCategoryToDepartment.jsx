import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { createCategoryService } from '../../services/CompanyStructure/addCategoryToDepartment';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import image2 from '../../assets/image2.png';
import { motion, AnimatePresence } from 'framer-motion';
import { useDepartments } from '../../hooks/useDepartments';
import Loading from '../../components/common/Loading';
import LoadingCircle from '../../components/common/LoadingCircle';

const CreateCategoryToDepartment = () => {
  const GO = useNavigate();

  // 1. إدارة الحالة: تم حذف تكرار تعريف departments و error
  // تم تغيير اسم خطأ التحقق إلى validationError لتمييزه عن خطأ الـ API
  const [activeId, setActiveId] = useState(null); 
  const [categoryName, setCategoryName] = useState('');
  const [validationError, setValidationError] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('Token');

  // 2. جلب البيانات باستخدام Hook الـ React Query الذي أنشأناه
  const { 
    data: departments = [], 
    isLoading, 
    isError, 
    error: apiError 
  } = useDepartments(token);

  const handleSave = async () => {
    
    setLoading(true);
    if (!categoryName.trim()) {
      setValidationError(true);
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

        toast.success(response.message, {
          position: 'top-left',
          autoClose: 3000,
          className:
            '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
        });
      }
    } catch (error) {
          if (error.response) {
            // الخطأ جاء من السيرفر (مثلاً 401 Unauthorized)
            toast.error(error.response);
          } else {
            // خطأ شبكة غير متوقع أو أن الـ Interceptor قام بعمله
            console.error("Login Error:", error);
          }
        }finally{
      setLoading(false);
    }
  };
   
  return (
    <div className=" min-h-screen bg-gray-900 flex flex-row items-center justify-evenly gap-10 ">
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="rounded-xl w-full max-w-md flex justify-start items-start flex-col"
      >
        <motion.img
          src={image2}
          alt="Department illustration"
          className="w-30 h-30"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          whileHover={{ scale: 1.05 }}
        />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl font-bold text-white mt-4"
        >
          Create Category To The Department
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-sm font-semibold text-[#0D9EF2] mt-2"
        >
          "Please select the department you want to add sub-departments to. You
          can add multiple sub-departments; once you're ready, click Next."
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9 }}
          className="flex justify-start items-center gap-2 p-4 "
        >
          <Button
            onClick={() => GO(-1)}
            className="bg-transparent border border-gray-700 hover:bg-gray-800 text-gray-300 text-sm font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Previous
          </Button>

          <Button
            path={'/roles'}
           
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2 px-6 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
          >
            Next
          </Button>
        </motion.div>
      </motion.div>

      {/* استخدام isLoading القادم من React Query بدلاً من الحالة اليدوية */}
      {isLoading ? (
        <div className="w-full max-w-sm flex justify-center items-center">
             <p className="text-blue-400 animate-pulse">Loading Departments...</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: 'easeOut',
          }}
          className="w-full max-w-sm bg-[#171A21] rounded-xl shadow-2xl border border-gray-800 max-h-[80vh] overflow-auto custom-scrollbar"
        >
          <div className="p-6 space-y-2">
            <p className="text-white text-lg font-medium">Select a Department :</p>

            {isError ? (
              <p className="text-red-400 text-sm text-center py-4">{apiError?.message}</p>
            ) : departments.length === 0 ? (
              <div className="flex justify-center items-center py-10">
                <p className="text-gray-400 text-lg">No departments found.</p>
              </div>
            ) : (
              departments.map((dept) => (
                <div
                  key={dept.id}
                  className=" border-white border-2 rounded-lg overflow-hidden mb-2"
                >
                  <button
                    onClick={() => {
                      setActiveId((prev) => (prev === dept.id ? null : dept.id));
                      setValidationError(false);
                    }}
                    className={`w-full pt-1 pb-1 pl-1 flex justify-center items-center transition-colors ${
                      activeId === dept.id
                        ? 'bg-blue-600 '
                        : 'bg-transparent hover:bg-gray-800/50'
                    }`}
                  >
                    <span className="text-gray-200 font-medium">
                      {dept.name} Department
                    </span>
                  </button>

                  <AnimatePresence>
                    {activeId === dept.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 bg-[#111827] border-t border-gray-800">
                          <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4">
                            Add New Category
                          </h4>

                          <div className="space-y-4">
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
                                  Category name is required
                                </p>
                              )}
                            </div>

                            <div className="flex gap-3 pt-2">
                              <Button
                                
                                onClick={handleSave}
                                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2 px-6 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                              >
                                {loading ? (
                            <>
                                <LoadingCircle/>
                            </>
                            ):(
                                <p>save Category</p>
                            )}
                              </Button>

                              <Button
                                onClick={() => {
                                  setActiveId(null);
                                  setValidationError(false);
                                  setCategoryName('');
                                }}
                                className="bg-transparent border border-gray-700 hover:bg-gray-800 text-gray-300 text-sm font-medium py-2 px-6 rounded-lg transition-colors"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CreateCategoryToDepartment;