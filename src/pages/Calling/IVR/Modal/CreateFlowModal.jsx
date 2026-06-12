import React, { useState } from 'react';
// import { toast } from 'react-toastify';
import LoadingCircle from '../../../../components/common/LoadingCircle';
import Button from '../../../../components/common/Button';
import Modal from 'react-modal';

const CreateFlowModal = ({ isOpen, onClose}) => {
//   const token = localStorage.getItem('Token');
  const [loading, setLoading] = useState(false);

  // 1. بيانات الـ Flow
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // const payload = {
    //   name: formData.name,
    //   description: formData.description,
    //   active: true, // القيمة الافتراضية كما في الريكوست
    //   rootNodeId: null
    // };

    // try {
    //   // استبدل الرابط أدناه برابط الـ API الخاص بك
    //   const response = await fetch('{{base_url}}/api/ivr/flows', {
    //     method: 'POST',
    //     headers: { 
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${token}` 
    //     },
    //     body: JSON.stringify(payload),
    //   });

    //   if (response.ok) {
    //     toast.success("Flow created successfully!");
    //     setFormData({ name: '', description: '' });
    //     onSuccess(); // لتحديث القائمة أو الانتقال
    //     onClose();
    //   } else {
    //     toast.error("Failed to create flow");
    //   }
    // } catch (error) {
    //   toast.error("Error connecting to server");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="outline-none "
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
    >
      <form onSubmit={handleSubmit} className="bg-[#171A21]  rounded-xl border border-[#2A2E37] p-8 w-full max-w-lg flex flex-col gap-6 shadow-3xl">
        <h2 className="text-2xl font-semibold text-white">Create New IVR Flow</h2>
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

        <div className="flex justify-end gap-4 border-t border-slate-800 pt-6">
          <Button onClick={onClose} className="text-slate-400 hover:text-white">Cancel</Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg">
            {loading ? <LoadingCircle /> : "Create Flow"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateFlowModal;