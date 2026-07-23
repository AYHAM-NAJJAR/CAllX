// pages/leads/ShowAllLeads.jsx
import React, { useCallback, useEffect, useState } from "react";
import { Users, Loader2, AlertCircle, Plus, Inbox } from "lucide-react";
import Button from "../../../components/common/Button";
import LeadCard from "./components/LeadCard";

import { getLeads } from "../../../services/CRM/Leads/getLeads";
import CreateLeadModal from "./Modal/CreateLeadModal";
import UpdateLeadModal from "./Modal/UpdateLeadModal";

const GetLeads = () => {
  const token = localStorage.getItem("Token");

  // States
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
   const [isModalCreateLeadOpen,setIsModalCreateLeadOpen]=useState(false)
   const [isModalUpdateLeadOpen,setIsModalUpdateLeadOpen]=useState(false)
   const [selectedLeadId, setSelectedLeadId] = useState(null); // 1. إضافة State للـ ID

// 2. تحديث دالة فتح المودال عند الضغط على الـ Card
const handleOpenUpdateModal = (id) => {
  setSelectedLeadId(id);
  setIsModalUpdateLeadOpen(true);
};
  const refreshLeads = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await getLeads(token);
      setLeads(data);
      setIsError(false);
    } catch (err) {
      setIsError(true);
      console.error("Error fetching leads:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);
  
  useEffect(() => {
    refreshLeads();
  }, [refreshLeads]);

  return (
    <div className="p-8 bg-[#0F172A] min-h-screen text-white">
      <CreateLeadModal
        // data={Customers} 
        isOpen={isModalCreateLeadOpen} 
        onSuccess={() => refreshLeads()}
        onClose={() => setIsModalCreateLeadOpen(false)}
        
      />
       <UpdateLeadModal
        isOpen={isModalUpdateLeadOpen}
        leadId={selectedLeadId} // تمرير الـ ID المختار
        onSuccess={() => {
          refreshLeads();
          setSelectedLeadId(null); // إعادة التصفير بعد النجاح
        }}
        onClose={() => {
          setIsModalUpdateLeadOpen(false);
          setSelectedLeadId(null);
        }}
      />
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#101B22] border border-[#1e293b] flex items-center justify-center">
            <Users className="text-[#0D9EF2]" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Leads Management</h1>
            <p className="text-gray-500 text-sm">Track and manage your potential customers</p>
          </div>
        </div>
        
        <Button 
        onClick={() => setIsModalCreateLeadOpen(true)}
        className="bg-[#0D9EF2] hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all">
          <Plus size={18} /> Create Lead
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
          <Loader2 className="animate-spin text-[#0D9EF2] mb-4" size={40} />
          <p className="font-medium">Loading leads data...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-red-400">
          <AlertCircle size={48} className="mb-4" />
          <h2 className="text-xl font-bold">Failed to load</h2>
          <p className="text-gray-500">Please check your connection and try again.</p>
        </div>
      ) : leads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onClickable={() => handleOpenUpdateModal(lead.id)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-[#1e293b] rounded-2xl">
          <Inbox size={48} className="text-gray-600 mb-4" />
          <h2 className="text-lg font-semibold text-gray-400">No Leads Found</h2>
          <p className="text-gray-600 text-sm">Start by creating your first lead</p>
        </div>
      )}
    </div>
  );
};

export default GetLeads;