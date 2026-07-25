import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketByID } from '../../services/Tickets/getOneTicket';
import LoadingError from "../../components/common/LoadingError";
import LoadingCircle from "../../components/common/LoadingCircle";
import Button from '../../components/common/Button';
import UpdateTicketModal from './Modal/UpdateTicketModal';
import DeleteTicketModal from './Modal/DeleteTicketModal';
import { CircleChevronLeft } from 'lucide-react';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("Token");
  const [isOpenModalUpdateTicket, setIsOpenModalUpdateTicket] = useState(false);
  const [isOpenModalDeleteTicket, setIsOpenModalDeleteTicket] = useState(false);

  const refreshTicketById = useCallback(async () => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        const res = await getTicketByID(token, id);
        
        if (res) {
          setTicket(res);
        } 
      } catch (err) {
        setError("فشل في تحميل بيانات التذكرة.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTicketData();
    }
    }, [token, id]);

  useEffect(() => {
    refreshTicketById();
  }, [refreshTicketById]);

  if (loading) {
    return <LoadingCircle Phrase={"Ticket Details"} />;
  }

  if (error || !ticket) {
    return <LoadingError Phrase={error || "Ticket Details"} />;
  }

  const formattedDate = new Date(ticket.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-primary text-gray-200 font-sans">
      <UpdateTicketModal data={ticket} onSuccess={refreshTicketById}  isOpen={isOpenModalUpdateTicket} onClose={setIsOpenModalUpdateTicket}/>
      <DeleteTicketModal data={ticket} isOpen={isOpenModalDeleteTicket} onClose={setIsOpenModalDeleteTicket}/>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 lg:py-12">
        
        {/* Header - ينقلب عمودياً في الهواتف وتتوزع الأزرار تلقائياً */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div className="flex items-center gap-4">
            <Button
            path={"/main/system/tickets"}
            >
              <CircleChevronLeft className='text-sky-600 hover:text-sky-700 transition-all ease-in ' size={25} />
            </Button>
            
            <h1 className="text-lg sm:text-xl font-bold tracking-wider text-white">Ticket Details</h1>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              onClick={() => setIsOpenModalUpdateTicket(true)}
              className="flex-1 sm:flex-initial justify-center rounded-full bg-customButton hover:bg-sky-400 ease-in transition-colors px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold text-white text-center"
            >
              Edit Ticket details
            </Button>
            <Button
              onClick={() => setIsOpenModalDeleteTicket(true)}
              className="flex-1 sm:flex-initial justify-center rounded-full text-white bg-red-400 hover:bg-red-600 ease-in transition-colors px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold text-center"
            >
              Delete Ticket
            </Button>
          </div>
        </header>

        {/* Ticket Header Info & Badges */}
        <section className="mb-8 sm:mb-10">
          <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-4 sm:mb-5">
            <span className="bg-[#153444] text-[#81D4FA] text-[10px] font-bold px-3 py-0.5 rounded uppercase tracking-wider">
              {ticket.priority} Priority
            </span>
            <span className="bg-[#1E3A2E] text-[#66BB6A] text-[10px] font-bold px-3 py-0.5 rounded uppercase tracking-wider">
              {ticket.status}
            </span>
            {ticket.categoryName && (
            <div className='flex items-center justify-center  '>
              <span className="bg-gray-800 text-gray-300 text-[10px] mr-2 font-bold px-3 py-0.5 rounded uppercase tracking-wider">Department : {ticket.department || 'N/A'}</span>
              <span className="bg-gray-800 text-gray-300 text-[10px] font-bold px-3 py-0.5 rounded uppercase tracking-wider">
                Category : {ticket.categoryName}
              </span>
            </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
            <div className="w-full">
              <div className="flex flex-wrap items-center justify-start gap-2 sm:gap-4 mb-2 sm:mb-0">
                <span className="text-gray-500 text-base sm:text-lg font-mono block">Ticket #{ticket.ticketId || ticket.id}</span>
                <p className="bg-slate-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold hover:bg-sky-600 transition shrink-0">
                  {ticket.assignedToId ? `Assigned To: ${ticket.assignedToName}` : 'Assign Agent'}
                </p>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mt-1 sm:mt-2 break-words">
                {ticket.title}
              </h2>
              <p className="text-gray-500 mt-2 text-xs sm:text-sm">Created on {formattedDate}</p>
            </div>
          </div>
        </section>

        {/* Customer Profile Section - تحويل w-fit إلى w-full متجاوب */}
        <section className="bg-[#111821] border border-gray-800 w-full rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-10 mb-8 sm:mb-10">
          <div className="space-y-4 sm:space-y-6 flex-1 w-full">
            <div>
              <p className="text-[#00A3FF] text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-1 sm:mb-1.5">
                This Ticket Is For Customer :
              </p>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white break-words">{ticket.userName}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-4 sm:gap-x-8 text-gray-300 text-xs sm:text-sm">
              <div className="flex items-center gap-3 break-all">
                <span className="text-base sm:text-lg text-gray-500 shrink-0">✉</span>
                <span>{ticket.userEmail}</span>
              </div>
              {ticket.location && (
                <div className="flex items-center gap-3">
                  <span>{ticket.location}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content Body Grid - عمود واحد للموبايل و3 أعمدة للشاشات الكبيرة */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          
          {/* Main Content Area (Left Column) */}
          <section className="lg:col-span-2 space-y-6 sm:space-y-10">
            
            {/* Primary Ticket Description Box */}
            <div className="bg-[#111821] border border-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-gray-800/60">
                <h4 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">Issue Description</h4>
              </div>
              <div className="text-gray-200 text-sm sm:text-base leading-relaxed bg-[#151D29]/40 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-800/50 whitespace-pre-line min-h-[120px] sm:min-h-[150px] break-words">
                {ticket.description || <span className="text-gray-500 italic">No description provided.</span>}
              </div>
            </div>

            {/* Dynamic Attributes Section */}
{ticket.dynamicAttributes && Object.keys(ticket.dynamicAttributes).length > 0 && (
  <div className="bg-[#111821] border border-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 space-y-4 sm:space-y-6">
    <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-gray-800/60">
      <h4 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">Additional Details</h4>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      {Object.entries(ticket.dynamicAttributes).map(([key, value]) => {
        const formattedLabel = key.replace(/_/g, ' ');

        return (
          <div key={key} className="bg-[#151D29]/40 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-800/50 flex flex-col gap-2">
            <span className="text-gray-500 text-xs sm:text-sm font-bold uppercase tracking-widest">
              {formattedLabel}
            </span>
            
            {Array.isArray(value) ? (
              <div className="flex flex-col gap-2">
                {value.map((item, idx) => {
                  const isImage = typeof item === 'string' && item.startsWith('data:image/');
                  return isImage ? (
                    <div key={idx} className="mt-2 rounded-lg overflow-hidden border border-gray-700 bg-black/20">
                      <img src={item} alt={`${formattedLabel} ${idx + 1}`} className="w-full h-auto object-contain max-h-64 cursor-pointer hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <span key={idx} className="text-gray-200 text-sm sm:text-base break-words font-medium">{String(item)}</span>
                  );
                })}
              </div>
            ) : typeof value === 'string' && value.startsWith('data:image/') ? (
              <div className="mt-2 rounded-lg overflow-hidden border border-gray-700 bg-black/20">
                <img src={value} alt={formattedLabel} className="w-full h-auto object-contain max-h-64 cursor-pointer hover:scale-105 transition-transform duration-300" />
              </div>
            ) : (
              <span className="text-gray-200 text-sm sm:text-base break-words font-medium">
                {String(value)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}

            {/* Images / Attachments Section */}
            {ticket.images && ticket.images.length > 0 && (
              <div className="bg-[#111821] border border-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <span className="text-xl sm:text-2xl text-[#00A3FF]">📎</span>
                  <h4 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">Attachments ({ticket.images.length})</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                  {ticket.images.map((img, index) => (
                    <div key={index} className="aspect-square bg-[#151D29] border border-gray-800 rounded-xl overflow-hidden group cursor-pointer hover:border-[#1E88E5] transition">
                      <img src={img} alt={`Attachment ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Sidebar Area (Right Column) */}
          <aside className="space-y-6 sm:space-y-10">
            
            {/* Ticket Stats */}
            <div className="bg-[#111821] border border-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 sm:mb-6">Ticket Stats</h4>
              <div className="space-y-4 sm:space-y-5 text-sm sm:text-base">
                <div className="flex justify-between items-center pb-4 sm:pb-5 border-b border-gray-800/60">
                  <span className="text-gray-500 text-xs sm:text-sm">Assigned To</span>
                  <span className={`text-white font-semibold flex items-center gap-2 text-xs sm:text-sm ${!ticket.assignedToId ? 'text-gray-500 font-normal' : ''}`}>
                    {!ticket.assignedToId && <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-700 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] text-gray-400 font-bold">UA</div>}
                    {ticket.assignedToName}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 sm:pb-5 border-b border-gray-800/60">
                  <span className="text-gray-500 text-xs sm:text-sm">Category</span>
                  <span className="text-white font-semibold text-xs sm:text-sm">{ticket.categoryName || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-xs sm:text-sm">Last Update</span>
                  <span className="text-white font-semibold text-xs sm:text-sm">
                    {new Date(ticket.updatedAt).toLocaleDateString('en-US')}
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            {ticket.adminNotes && (
              <div className="bg-[#111821] border border-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-l-4 border-l-[#1E88E5]">
                <div className="flex gap-3">
                  <span className="text-xl sm:text-2xl text-[#1E88E5] shrink-0">ⓘ</span>
                  <div className="space-y-1.5 sm:space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Admin Notes</h4>
                    <p className="text-gray-400 text-xs sm:text-base font-mono leading-relaxed break-words">
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

export default TicketDetails;