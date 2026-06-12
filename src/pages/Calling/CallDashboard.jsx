
import menu from '../../assets/menu.png'; 
import { Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { useHotkeys } from "react-hotkeys-hook";
import Button from '../../components/common/Button';
import Modal from "react-modal";
import ModalFastCall from '../../components/private/agent/ModalFastCall';
import { useState } from 'react';
import ModalCall from '../../components/private/agent/ModalCall';
import ModalWrapUp from '../../components/private/agent/ModalWrapUp';
import InBoundedCalls from './components/InBoundedCalls';
const CallDashboard = () => {
   const navigate = useNavigate();
    const [openCall, setOpenCall] = useState(false);
    const [openFastCall, setOpenFastCall] = useState(false);
    const [wrapUpOpen, setWrapUpOpen] = useState(true);
  useHotkeys("c", (event) => {
    event.preventDefault(); 
    navigate("/main/customers"); 
  });

  useHotkeys("v", (event) => {
    event.preventDefault(); 
    setOpenFastCall(true);
      
  });

  useHotkeys("1", (event) => {
    event.preventDefault(); 
    setOpenCall(true);
      
  });
  useHotkeys("esc", () => setOpenFastCall(false));
  
  const inboundCalls = [
    { name: '+956 844 55', sub: 'United States', wait: '40s', vip: false },
    { name: 'Sarah Jenkins', sub: '+1 202 555 0109', wait: '1m 12s', vip: true },
    { name: '+44 7700 900504', sub: 'United Kingdom', wait: '2m 45s', vip: false },
    { name: 'Mike Ross', sub: 'Incoming via IVR', wait: '5s', vip: false },
  ];

  const outboundCalls = [
    { name: '+1 415 555 0122', sub: 'Callback Request', duration: '4m 30s' },
    { name: 'John Doe', sub: 'Follow-up Call', duration: '12m 10s' },
    { name: 'Alice Cooper', sub: 'Sales Lead', duration: '2m 15s' },
    { name: 'Tech Support', sub: 'Internal Referral', duration: '8m 05s' },
  ];
  const { toggleSidebar } = useOutletContext();
    const location = useLocation();
  const isSubRoute = location.pathname.includes('makecall');
  const fromCallroom = location.state?.from === "callroom";

  
  if (isSubRoute) {
    return <Outlet/>;
  }
  return (
    <div className=" min-h-screen bg-primary text-white p-8 font-sans">
      <ModalFastCall  isOpen={openFastCall} setIsOpen={setOpenFastCall}/>
      <ModalCall isOpen={openCall}  setIsOpen={setOpenCall}/>
      {fromCallroom && <ModalWrapUp isOpen={wrapUpOpen} setIsOpen={setWrapUpOpen}/>}
      {/* Header Section */}
      <header className="flex justify-between items-center mb-10">
         
        <div className='flex items-center justify-center gap-5' >
          <img  onClick={toggleSidebar}   src={menu} className='w-8 h-8 cursor-pointer' alt="" />
         <div>
           <h1 className="text-2xl font-bold">Call Center</h1>
          <p className="text-gray-400 text-sm">Manage active and incoming customer inquiries</p>
         </div>
        </div>
        <div className='flex items-centre justify-center gap-10'>
          
        <Button 
        path={"/main/customers"}
        className="bg-[#0D9EF2]  text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition-all">
          Customers
        </Button>
        <Button 
        path={"/main/makecall"}
        className="bg-[#22c55e] hover:bg-[#1eb054] text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition-all">
          Make Call
        </Button>
        </div>
        
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Inbound Calls Column */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-blue-400 font-semibold flex items-center gap-2">
              <span className="text-lg">↙</span> Inbound Calls (4)
            </h2>
            <span className="text-gray-500 text-xs tracking-widest uppercase">Active Queue</span>
          </div>

          <div className="space-y-3">
            {inboundCalls.map((call) => (
              <InBoundedCalls
              name={call.name}
              sub={call.sub}
              wait={call.wait}
              
              />
            ))}
          </div>
        </section>

        {/* Outbound Calls Column */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-orange-400 font-semibold flex items-center gap-2">
              <span className="text-lg">↗</span> Outbound Calls (4)
            </h2>
            <span className="text-gray-500 text-xs tracking-widest uppercase">Recent Logs</span>
          </div>

          <div className="space-y-3">
            {outboundCalls.map((call) => (
              <InBoundedCalls
                name={call.name}
                sub={call.sub}
                wait={call.duration}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CallDashboard;