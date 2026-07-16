import React, {useState } from 'react';
import {useNavigate } from 'react-router-dom';


import Button from '../../../components/common/Button';
import UpdateCustomerModal from './Modal/UpdateCustomerModal';

const CustomerDetails = () => {
//   const { id } = useParams();
  const navigate = useNavigate();

 
  const [isOpenModalUpdateTicket, setIsOpenModalUpdateTicket] = useState(false);
//   const [isOpenModalDeleteTicket, setIsOpenModalDeleteTicket] = useState(false);

  // 2. دمج البيانات الثابتة (Mock Data) وتجهيزها لتناسب التصميم والريسبونس المطلوب
  const [ticket] = useState({
    id: 101,
    ticketId: "101",
    title: "Enterprise Subscription Renewal Support", // عنوان افتراضي للتناسب مع التصميم
    description: "The customer is requesting an urgent review of their subscription renewal terms for Q3. They require custom onboarding support as part of their VIP status benefits.", // وصف افتراضي
    name: "Layla Haddad", // الاسم من الريسبونس الخاص بك
    userName: "Layla Haddad", 
    userEmail: "layla.haddad@enterprise.com",
    type: "VIP", // النوع من الريسبونس
    priority: "High", 
    status: "Active", // الحالة من الريسبونس
    ownerAgentId: 7, // معرف الوكيل المسؤول من الريسبونس
    assignedToId: 7,
    assignedToName: "Agent #7",
    categoryName: "Subscription",
    department: "Customer Success",
    location: "Beirut, Lebanon",
    tagNames: ["High Value", "Renewal Q3"], // الوسوم من الريسبونس
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    adminNotes: "VIP client. Ensure quick resolution and coordinate with the account manager.",
    images: [] // مصفوفة المرفقات
  });

  // حساب التاريخ المنسق للعرض
  const formattedDate = new Date(ticket.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-primary text-gray-200 font-sans">
     
      <UpdateCustomerModal
        data={ticket} 
        isOpen={isOpenModalUpdateTicket} 
        onClose={() => setIsOpenModalUpdateTicket(false)}
      />
      {/* 
     
      <DeleteTicketModal 
        data={ticket}  
        isOpen={isOpenModalDeleteTicket} 
        onClose={() => setIsOpenModalDeleteTicket(false)}
      /> */}

      <div className="container mx-auto px-10 py-12">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-wider text-white">Customer Details</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/main/customers")}
              className="bg-[#151D29] border border-gray-800 rounded-full ease-in transition-colors px-6 py-2.5 text-sm font-semibold hover:bg-gray-800"
            >
              Back to List
            </Button>
            <Button
              onClick={() => setIsOpenModalUpdateTicket(true)}
              className="rounded-full bg-customButton hover:bg-sky-400 ease-in transition-colors px-6 py-2.5 text-sm font-bold text-white"
            >
              Edit Customers details
            </Button>
            <Button
            //   onClick={() => setIsOpenModalDeleteTicket(true)}
              className="rounded-full text-white bg-red-400 hover:bg-red-600 ease-in transition-colors px-6 py-2.5 text-sm font-bold"
            >
              Delete Customers
            </Button>
          </div>
        </header>

        {/* Ticket Header Info & Badges */}
        <section className="mb-10">
          <div className="flex flex-wrap gap-2.5 mb-5">
            {/* عرض شارة VIP / النوع */}
            <span className="bg-[#153444] text-[#81D4FA] text-[10px] font-bold px-3 py-0.5 rounded uppercase tracking-wider">
              {ticket.type} Status
            </span>
            {/* عرض الحالة */}
            <span className="bg-[#1E3A2E] text-[#66BB6A] text-[10px] font-bold px-3 py-0.5 rounded uppercase tracking-wider">
              {ticket.status}
            </span>
            {/* عرض وسوم tagNames القادمة من الريسبونس */}
            {ticket.tagNames && ticket.tagNames.map((tag, idx) => (
              <span key={idx} className="bg-gray-800 text-gray-300 text-[10px] font-bold px-3 py-0.5 rounded uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center justify-start gap-4">
                <span className="text-gray-500 text-lg font-mono block mb-1">
                  Ticket #{ticket.id}
                </span>
                <p className="bg-slate-600 text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-sky-600 transition shrink-0">
                  {ticket.ownerAgentId ? `Assigned Agent ID: ${ticket.ownerAgentId}` : 'Assign Agent'}
                </p>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
                {ticket.title}
              </h2>
              <p className="text-gray-500 mt-2 text-sm">Created on {formattedDate}</p>
            </div>
          </div>
        </section>

        {/* Customer Profile Section */}
        <section className="bg-[#111821] border border-gray-800 w-fit rounded-3xl p-10 flex items-center justify-between gap-10 mb-10">
          <div className="space-y-6 flex-1">
            <div>
              <p className="text-[#00A3FF] text-xs font-bold tracking-widest uppercase mb-1.5">
                Created By
              </p>
              <h3 className="text-3xl font-extrabold text-white">{ticket.name}</h3>
              <p className="text-gray-400 text-sm mt-1.5">
                Department: <span className="text-white font-semibold">{ticket.department || 'N/A'}</span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-gray-300 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-lg text-gray-500">✉</span>
                <span>{ticket.userEmail}</span>
              </div>
              {ticket.location && (
                <div className="flex items-center gap-3">
                  <span className="text-lg text-gray-500">📍</span>
                  <span>{ticket.location}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content Body Grid */}
        <div className="grid grid-cols-3 gap-10">
          
          {/* Main Content Area (Left Column) */}
          <section className="col-span-2 space-y-10">
            
            {/* Primary Ticket Description Box */}
            <div className="bg-[#111821] border border-gray-800 rounded-3xl p-10 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-800/60">
                <h4 className="text-lg font-bold text-white uppercase tracking-wider">Issue Description</h4>
              </div>
              <div className="text-gray-200 text-base leading-relaxed bg-[#151D29]/40 p-6 rounded-2xl border border-gray-800/50 whitespace-pre-line min-h-[150px]">
                {ticket.description || <span className="text-gray-500 italic">No description provided.</span>}
              </div>
            </div>

            {/* Images / Attachments Section */}
            {ticket.images && ticket.images.length > 0 && (
              <div className="bg-[#111821] border border-gray-800 rounded-3xl p-10">
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-2xl text-[#00A3FF]">📎</span>
                  <h4 className="text-xl font-bold text-white uppercase tracking-wider">Attachments ({ticket.images.length})</h4>
                </div>
                <div className="flex flex-wrap gap-5">
                  {ticket.images.map((img, index) => (
                    <div key={index} className="w-40 h-40 bg-[#151D29] border border-gray-800 rounded-xl overflow-hidden group cursor-pointer hover:border-[#1E88E5] transition">
                      <img src={img} alt={`Attachment ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Sidebar Area (Right Column) */}
          <aside className="space-y-10">
            
            {/* Ticket Stats */}
            <div className="bg-[#111821] border border-gray-800 rounded-3xl p-10">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Ticket Stats</h4>
              <div className="space-y-5 text-base">
                <div className="flex justify-between items-center pb-5 border-b border-gray-800/60">
                  <span className="text-gray-500">Assigned To</span>
                  <span className={`text-white font-semibold flex items-center gap-2 ${!ticket.assignedToId ? 'text-gray-500 font-normal' : ''}`}>
                    {!ticket.assignedToId && <div className="w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center text-[10px] text-gray-400 font-bold">UA</div>}
                    Agent #{ticket.ownerAgentId}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-5 border-b border-gray-800/60">
                  <span className="text-gray-500">Category</span>
                  <span className="text-white font-semibold">{ticket.categoryName || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Last Update</span>
                  <span className="text-white font-semibold text-sm">
                    {new Date(ticket.updatedAt).toLocaleDateString('en-US')}
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            {ticket.adminNotes && (
              <div className="bg-[#111821] border border-gray-800 rounded-3xl p-8 border-l-4 border-l-[#1E88E5]">
                <div className="flex gap-3">
                  <span className="text-2xl text-[#1E88E5]">ⓘ</span>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Admin Notes</h4>
                    <p className="text-gray-400 text-base font-mono leading-relaxed">
                      "{ticket.adminNotes}" 
                    </p>
                  </div>
                </div>
              </div>
            )}
          </aside>
          
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;