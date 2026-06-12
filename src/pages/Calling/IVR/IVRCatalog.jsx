import React from 'react';
import mainmenu from "../../../assets/mainmenu.png"
import voicemail from "../../../assets/voicemail.png"
import hangup from "../../../assets/hangup.png"
import transfer from "../../../assets/system.png"
import Button from '../../../components/common/Button';

const IVRCatalog = () => {
  const nodes = [
    {
      id: 'menu',
      name: 'Menu Node',
      description: 'The primary routing node; allows callers to choose between multiple paths based on keypad input.',
      icon: mainmenu,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'transfer',
      name: 'Transfer Node',
      description: 'Used to forward an active call to an external number, internal extension, or a specific queue.',
      icon: transfer,
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 'hangup',
      name: 'Hangup Node',
      description: 'The terminal node to end the connection. Securely closes the line after a successful operation.',
      icon: hangup,
      color: 'bg-red-50 border-red-200'
    },
    {
      id: 'voicemail',
      name: 'Voicemail Node',
      description: 'Directs the caller to the voicemail system to leave a recorded message if there is no answer.',
      icon: voicemail,
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  return (
    <div className="min-h-screen bg-[#101B22] flex flex-col items-center justify-center p-4 font-sans">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-4">IVR System Catalog</h1>
        <p className="text-gray-300 text-lg">
          The Interactive Voice Response (IVR) system is the mastermind of your call center. 
          Use this catalog to understand the core components for building smart and efficient call flows.
        </p>
        <h1 className='mt-5 text-white font-bold text-2xl '>NODES</h1>
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl">
        {nodes.map((node) => (
          <div 
            key={node.id} 
            className={`flex flex-col bg-scondary items-center text-center p-6 rounded-2xl border-2 border-sky-600 transition-all hover:border-sky-800 max-w-[240px]`}
          >
            {/* Icon Container */}
            <div className="p-2 rounded-full shadow-sm mb-3 w-20 h-20 flex items-center justify-center">
              <img src={node.icon} alt={node.name} className="w-10 h-10 object-contain" />
            </div>
            
            {/* Text Content */}
            <div>
              <h3 className="text-xl font-bold mb-2 text-sky-500 ">{node.name}</h3>
              <p className="text-lg text-white font-semibold leading-relaxed ">
                {node.description}
              </p>
            </div>
            
          </div>
        ))}
        
      </div>
      <Button
        path={"/ivr"}
        type={"submit"}
        className="rounded-lg bg-customButton px-5 py-2.5 mt-8 text-sm font-bold text-[#0f172a] hover:bg-[#c5d3ff] transition-all"
        >
        Build IVR System
        </Button>
    </div>
  );
};

export default IVRCatalog;