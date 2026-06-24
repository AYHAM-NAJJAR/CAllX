import React, { useState, useEffect } from 'react';
import Button from '../../../../components/common/Button';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import LoadingInButton from '../../../../components/common/LoadingInButton';
import { updateFlow } from '../../../../services/call/IVR/Flow/updateFlow';
import { deleteFlow } from '../../../../services/call/IVR/Flow/deleteFlow';


const UpdateFlowModal = ({ isOpen, onClose, onSuccess, flowData }) => {
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const token = localStorage.getItem("Token");
  
  const [isActive, setIsActive] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  // تضمن هذه الخطوة تحديث حقول الفورم داخلياً كلما تغير الـ flowData القادم من الأب
  useEffect(() => {
    if (flowData) {
      setIsActive(flowData.active);
      setFormData({
        name: flowData.name || '',
        description: flowData.description || '',
      });
    }
  }, [flowData, isOpen]); // يعمل عند تغيير العنصر أو عند فتح المودال

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      description: formData.description,
      active: isActive, 
      rootNodeId: null
    };
    console.log(payload);
    try {
      const response = await updateFlow(flowData.id, payload, token);
      if (response.success) {
        toast.success(response.message || "Updated successfully", {
          position: "top-left",
          autoClose: 3000,
          className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
        });
        onSuccess(); 
        onClose(); 
      } else {
        toast.error(response.message || "Failed to update");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };
    async function handleDelete() {
    
     setLoadingDelete(true);
     const response = await deleteFlow(flowData.id,token);
     
     if (response.success) {
       toast.success(response.message, {
                 position: "top-left",
                 autoClose: 3000,
                 className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
               });
           setLoadingDelete(false)
          onSuccess(); 
           onClose()
           
     } else {
       alert(`Error: ${response.message}`);
     }

  }
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="outline-none "
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
    >
      <form  className="bg-[#171A21] rounded-xl border border-[#2A2E37] p-8 w-full max-w-lg flex flex-col gap-6 shadow-3xl">
        <h2 className="text-2xl font-semibold text-white">Update IVR Flow Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Flow Name</label>
            <input 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full text-white bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
              required
            />
          </div>
        </div>
        <div className="bg-[#1e293b]/50 border border-slate-700/50 rounded-lg p-4 flex items-center justify-between ">
          <div>
            {/* تم التعديل هنا ليعتمد على الـ State المحلية isActive */}
            <p className="text-sm font-bold text-white">{isActive ? "ACTIVE" : "DISABLE"}</p>
            <p className="text-xs text-slate-500">This Flow is {isActive ? "ACTIVE" : "DISABLE"} </p>
          </div>
          <button 
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${isActive ? 'bg-emerald-500' : 'bg-slate-600'}`}
          >
            <div className={`bg-[#0f172a] w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
        <div className="flex justify-end gap-4 border-t border-slate-800 pt-6">
          <Button type="button" onClick={onClose} className="text-slate-400 hover:text-white">Cancel</Button>
          <Button type="button" onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg">
            {loading ? <LoadingInButton/> : "Update Flow"}
          </Button>
          <Button type="button" onClick={handleDelete} className="bg-red-400 hover:bg-red-700 text-white px-6 py-2 rounded-lg">
            {loadingDelete ? <LoadingInButton/> : "Delete flow"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateFlowModal;