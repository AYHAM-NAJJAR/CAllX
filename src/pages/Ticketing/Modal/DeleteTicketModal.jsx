import Modal from 'react-modal';


import { useState } from 'react';
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Button from '../../../components/common/Button';
import LoadingCircle from '../../../components/common/LoadingCircle';
import { deleteTicket } from '../../../services/Tickets/deleteTicket';

const DeleteTicketModal = ({isOpen,onClose , data}) => {
  
  const GO =  useNavigate()
  const [loading , setLoading]= useState(false)
  const token = localStorage.getItem("Token");
  const handleDelete = async () => {
     setLoading(true);
     const response = await deleteTicket(data.id,token);
     
     if (response.success) {
      
       toast.success(response.message, {
                 position: "top-left",
                 autoClose: 3000,
                 className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
               });
           setLoading(false)
           onClose()
           GO("/main/system/tickets")
     } else {
       alert(`Error: ${response.message}`);
     }
}

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="outline-none" 
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-sm p-4"
    >
    <div className="bg-[#171A21] rounded-xl border border-[#2A2E37] p-10 w-full max-w-2xl flex flex-col items-center gap-6 shadow-3xl max-h-[80vh] overflow-auto custom-scrollbar">
        <p className=' font-bold text-xl  text-red-600'>Confirm Permanent Deletion</p>
        <p className='text-white font-bold '> <span className='text-red-600 font-extrabold'>Warning:</span> Are you absolutely sure you want to delete this ticket?

Please be advised that this action is completely irreversible. Deleting this ticket will permanently remove all associated data, including the initial issue description, entire conversation history, internal agent notes, and all uploaded attachments or screenshots from our servers.

Once confirmed, this information cannot be recovered or restored by administrators. Furthermore, any linked statistics, resolution times, and performance metrics associated with this ticket will be permanently altered or removed from the department analytics.

If you wish to proceed and understand that this data will be lost forever, please confirm your choice. Otherwise, click cancel to keep the ticket intact.</p>
        <div className='flex flex-row items-center gap-6'>
        <Button
        onClick={handleDelete}
        className="rounded-full text-white  bg-red-400 hover:bg-red-600 ease-in transition-colors   px-6 py-2.5 text-sm font-bold  ">
        Yes, Delete
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


export default  DeleteTicketModal;