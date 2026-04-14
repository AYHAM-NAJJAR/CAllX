import React from 'react';
import menu from '../../assets/menu.png'; 
import { Outlet, useLocation, useNavigate, useOutletContext} from 'react-router-dom';
import Button from '../../components/common/Button.jsx'
import { useHotkeys } from 'react-hotkeys-hook';
import '../../index.css'

const Tickets= () => {
   const navigate = useNavigate();
  useHotkeys("m", (event) => {
      event.preventDefault(); 
      navigate("/main"); 
    });
   const location = useLocation();
      const { toggleSidebar} = useOutletContext();
  
  const isSubRoute = location.pathname.includes('alltickets');

  
  if (isSubRoute) {
    return <Outlet/>;
  }
    
  return (
    <div className="flex min-h-screen bg-[#080C11] text-gray-300 font-sans ">
      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 overflow-y-auto ">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="space-y-1 cursor-pointer">
              <img src={menu} onClick={toggleSidebar} className='w-8 h-8' alt="" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase">Tickets</h1>
          </div>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Search tickets..." 
              className="bg-[#151D29] border border-gray-800 rounded-full px-6 py-2 text-sm w-64 focus:outline-none focus:border-blue-500"
            />
            <div className="w-10 h-10 bg-[#151D29] border border-gray-800 rounded-full flex items-center justify-center text-xs">🔔</div>
          </div>
        </header>

        {/* Page Title */}
        <div className="mb-8">
          <h2 className="mb-1 text-3xl font-bold text-white">Tickets</h2>
          <p className="text-gray-500">Manage and monitor customer support requests</p>
        </div>

        {/* Recently Tickets Row */}
        <div className="mb-10">
          <h3 className="mb-4 text-sm font-bold tracking-widest text-gray-400 uppercase">Recently Tickets</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: '#1284', user: 'John Doe', type: 'TECHNICAL', desc: 'System crash when attempting to export large datasets. Error code: 0x8849.' },
              { id: '#1285', user: 'Jane Smith', type: 'BILLING', desc: 'Request for duplicate invoice for the current month. Subscription plan change query.' },
              { id: '#1286', user: 'Robert Brown', type: 'PRODUCT', desc: 'Would like to suggest a dark mode toggle for the mobile application dashboard view.' }
            ].map((ticket, i) => (
              <div key={i} className="bg-[#111821] border border-gray-800 p-5 rounded-2xl">
                <div className="flex items-start justify-between mb-4">
                  <span className="bg-blue-600 text-[10px] font-bold px-2 py-0.5 rounded text-white">{ticket.id}</span>
                  <span className="text-[10px] text-gray-600 font-bold uppercase">{ticket.type}</span>
                </div>
                <h4 className="mb-2 font-bold text-white">{ticket.user}</h4>
                <p className="mb-4 text-xs leading-relaxed text-gray-500">{ticket.desc}</p>
                <span className="text-[10px] text-gray-600">🕒 2m ago</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lists Section */}
        <div className="grid grid-cols-2 gap-8">
          <TicketList title="All Tickets" color="text-green-500" />
          <TicketList title="All Tickets" color="text-blue-500" />
        </div>
      </main>
    </div>
  );
};

// Sub-component for the bottom lists
const TicketList = ({ title, color }) => (
  <div className="bg-[#111821] border border-gray-800 rounded-3xl p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center ${color}`}>📞</div>
      <h3 className="font-bold text-white">{title}</h3>
    </div>
    
    <div className="mb-6 space-y-4">
      {[1, 2, 3].map((_, i) => (
        <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 text-xs font-bold text-gray-400 bg-gray-800 rounded-full">JD</div>
            <div>
              <p className="text-sm font-bold text-white">John Doe</p>
              <p className="text-[10px] text-gray-600">Customer</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">555-0123</p>
            <p className="text-[10px] text-gray-600 uppercase font-bold tracking-tighter">Sales</p>
          </div>
        </div>
      ))}
    </div>
    <Button 
    path={"/main/tickets/alltickets"}
    className='w-full py-3 text-xs font-bold transition-colors border border-gray-800 rounded-xl hover:bg-gray-800'>
      SHOW All Tickets
    </Button>
  </div>
);

export default Tickets;