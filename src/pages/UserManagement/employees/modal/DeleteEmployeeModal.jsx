import Modal from 'react-modal';
import Button from '../../../../components/common/Button';
import { deleteEmployee } from '../../../../services/UserManagement/DeleteEmployee';
import { useState } from 'react';
import { toast } from 'react-toastify';
import LoadingCircle from '../../../../components/common/LoadingCircle';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
const DeleteEmployeeModal = ({isOpen,onClose , data}) => {
  const queryClient = useQueryClient();
  const GO =  useNavigate()
  const [loading , setLoading]= useState(false)
  const token = localStorage.getItem("Token");
  const handleDelete = async () => {
     setLoading(true);
     const response = await deleteEmployee(data.id,token);
     
     if (response.success) {
      await queryClient.invalidateQueries({ queryKey: ['allEmployees'] });
       toast.success(response.message, {
                 position: "top-left",
                 autoClose: 3000,
                 className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
               });
           setLoading(false)
           onClose()
           GO("/main/system/employee")
     } else {
       alert(`Error: ${response.message}`);
     }
   };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="outline-none" 
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-sm p-4"
    >
    <div className="bg-[#171A21] rounded-xl border border-[#2A2E37] p-10 w-full max-w-2xl flex flex-col items-center gap-6 shadow-3xl max-h-[80vh] overflow-auto custom-scrollbar">
        <p className=' font-bold text-xl  text-red-600'>Confirm Permanent Deletion</p>
        <p className='text-white font-bold '> <span className='text-red-600 font-extrabold'>Warning:</span>  You are about to permanently delete this user from the system. This action will remove all associated account information, role assignments, department associations, and access permissions. Once deleted, the user will no longer be able to access the platform, and this action cannot be undone. Please make sure you have selected the correct user before proceeding.</p>
        <div className='flex flex-row items-center gap-6'>
        <Button
        onClick={handleDelete}
        className="rounded-full text-white  bg-red-400 hover:bg-red-600 ease-in transition-colors   px-6 py-2.5 text-sm font-bold  ">
           {
            loading ? (
              <LoadingCircle/>
            ) : (
              <p>Yes , Delete</p>
            )
           }
        </Button>
        <Button
        onClick={onClose}
        className="rounded-full text-white  bg-slate-400 hover:bg-slate-700 ease-in transition-colors   px-6 py-2.5 text-sm font-bold  "
        >
            No , Close
        </Button>
        </div>
    </div>

    </Modal>
  );
};


export default  DeleteEmployeeModal;