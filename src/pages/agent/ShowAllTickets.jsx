import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { Outlet, useLocation } from 'react-router-dom';


const ShowAllTickets = () => {
  const [activeTab, setActiveTab] = useState('Open');
     const location = useLocation();
  
  
  const isSubRoute = location.pathname.includes('ticketdetails');

  
  if (isSubRoute) {
    return <Outlet/>;
  }
  const tickets = [
    {
      id: 1,
      category: 'CUSTOMER SUPPORT',
      user: 'Sarah Jenkins',
      phone: '+95684455',
      subject: 'Unable to access th...',
      priority: 'HIGH PRIORITY',
      color: 'bg-blue-400',
    },
    {
      id: 2,
      category: 'TECHNICAL DEPARTMENT',
      user: 'John Doe',
      phone: '+95684455',
      subject: 'System crash when attempting to export large datasets. Error code: 0x8849.',
      priority: 'MEDIUM',
      color: 'bg-orange-400',
    },
    {
      id: 3,
      category: 'ACCOUNT MANAGEMENT',
      user: 'Michael Chen',
      phone: '+95684455',
      subject: 'Requesting a demo ...',
      priority: 'LOW',
      color: 'bg-green-400',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-400 rounded-sm flex items-center justify-center">
              <div className="w-3 h-1 bg-blue-400"></div>
            </div>
            <h1 className="text-xl font-bold tracking-wide">All Tickets</h1>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search tickets..." 
                className="bg-[#1e293b] border-none rounded-full py-2 px-10 text-sm w-64 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <div className="absolute left-4 top-2.5 w-4 h-4 border-2 border-gray-400 rounded-full"></div>
            </div>
            <button className="bg-[#00a3ff] hover:bg-blue-500 px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
              <span className="text-lg">+</span> New Ticket
            </button>
          </div>
        </div>

        <div className="flex gap-8 mb-6 border-b border-gray-800 pb-0.5">
          {['Open (24)', 'Pending (12)', 'Closed (158)'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.split(' ')[0])}
              className={`pb-3 text-sm font-medium transition-all ${
                activeTab === tab.split(' ')[0] 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div 
              key={ticket.id} 
              className="bg-[#111827] border border-gray-800 rounded-2xl p-6 flex items-center justify-between hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start gap-6 w-1/3">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${ticket.color}`}></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest mb-1">{ticket.category}</p>
                  <h3 className="text-lg font-semibold">{ticket.user}</h3>
                  <p className="text-gray-500 text-xs mt-1">📞 {ticket.phone}</p>
                </div>
              </div>

              <div className="flex-1 px-4 border-l border-gray-800 h-16 flex flex-col justify-center">
                <p className="text-gray-300 text-sm line-clamp-2">{ticket.subject}</p>
                <span className={`text-[9px] font-bold mt-2 inline-block w-fit px-2 py-0.5 rounded bg-blue-900/20 text-blue-400 border border-blue-900/30`}>
                  {ticket.priority}
                </span>
              </div>

              <div className="flex gap-3 ml-8">
                <button className="bg-[#1e293b] hover:bg-gray-700 text-gray-200 text-xs font-semibold py-2.5 px-6 rounded-full transition-colors">
                  Attachments
                </button>
                <Button
                path={"/main/tickets/alltickets/ticketdetails"}
                className="bg-[#1e293b] hover:bg-gray-700 text-gray-200 text-xs font-semibold py-2.5 px-6 rounded-full transition-colors"
                >
                    View Details
                </Button>
               
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ShowAllTickets;